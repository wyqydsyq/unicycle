import * as R from 'ramda'
import xs from 'xstream'
import virtualize from 'snabbdom-virtualize/strings'
import { JSDOM } from 'jsdom'
import { htmlEncode } from 'js-htmlencode'
import { html, head, body, title, script, style, link, div, meta } from '@cycle/dom'

import { classes, Styles } from '../client/styles'

const titleText = require('../../package.json').title || 'Unicycle'

// prepare dynamically generated favicons for injection
const favicons = JSON.parse(require('fs').readFileSync('build/static/favicons.json').toString()).html
const htmlContext = new JSDOM('<html></html>')
const virtualizeHTML = html => virtualize(html, { context: htmlContext.window.document })

export const Boilerplate = (sources, ctx) => {
  return {
    DOM: sources.DOM.take(1).map(innerHTML =>
      html([
        head(R.concat(
          [
            title(htmlEncode(titleText)),
            meta({ props: { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' } })
          ],
          // append favicons to HTML head
          R.map(virtualizeHTML, favicons)
        )),
        body({
          class: classes(Styles.Body)
        }, [
          div('#main', [innerHTML]),
          script({
            attrs: {
              type: 'text/javascript',
              src: '/static/bundle.js'
            }
          }),
          style('#css', [`${Styles.render()}`])
        ])
      ])
    ),
    // wrap relative HTTP requests with protocol and host
    HTTP: sources.HTTP.map(request => {
      if (R.test(/^\//, request.url)) {
        return {
          ...request,
          url: `${ctx.protocol}://${ctx.host}${request.url}`
        }
      } else {
        return request
      }
    }),
    History: sources.History,
    Time: xs.empty()
  }
}

export default Boilerplate

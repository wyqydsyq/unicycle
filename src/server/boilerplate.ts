import * as R from 'ramda'
import xs from 'xstream'
import { html, head, body, title, script, style, link, div, meta } from '@cycle/dom'

import { classes, Styles } from '../client/styles'

export default function Boilerplate(sources, ctx) {
  return {
    // wrap app DOM in a boilerplate HTML document
    DOM: sources.DOM.take(1).map(innerHTML =>
      html([
        head([
          title('Cycle.js Boilerplate'),
          meta({ props: { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' } })
        ]),
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

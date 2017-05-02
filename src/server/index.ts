import * as koa from 'koa'
import * as send from 'koa-send'
import * as serve from 'koa-static'
import * as mount from 'koa-mount'
import { run } from '@cycle/run'
import { makeHTTPDriver } from '@cycle/http'
import { makeHTMLDriver } from '@cycle/html'
import { makeServerHistoryDriver } from '@cycle/history'
import { timeDriver } from '@cycle/time'
import switchPath from 'switch-path'

import ApiRoutes from './api/routes'
import ClientRoutes from '../client/routes'
import Main from '../client/main'
import Boilerplate from './boilerplate'

const server = new koa()
const port = process.env.PORT || 8080

// development mode
if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack')
  const ClientConfig = require('../../config/webpack/client.js')
  const compiler = webpack(ClientConfig)

  server.use(require('koa-webpack-dev-middleware')(compiler, ClientConfig.devServer))
  server.use(require('koa-webpack-hot-middleware')(compiler))
}

// serve static assets
server.use(mount('/sw.js', (ctx) => send(ctx, 'build/static/sw.js', {})))
server.use(mount('/static', serve('build/static')))

// match any api routes
server.use(mount('/api', async (ctx, next) => {
  const {path, value: Handler} = switchPath(ctx.path, ApiRoutes)
  if (Handler) {
    // call the handler with ctx and next, allowing it to behave like middleware
    await Handler(ctx, next)
  }
}))

// serve the app
server.use(async (ctx, next) => new Promise((res, rej) => {
  const {path, value: Page} = switchPath(ctx.path, ClientRoutes)
  if (Page) {

    // wrap the page DOM in the HTML boilerplate
    run(sources => {
      return Boilerplate(Main(sources), ctx)
    }, {
      DOM: makeHTMLDriver(html => {

        // respond with HTML output
        ctx.response.body = html
        return res(true)
      }),
      HTTP: makeHTTPDriver(),
      History: makeServerHistoryDriver({initialEntries: [ctx.path]}),
      Time: timeDriver
    })
  } else {
    return res(false)
  }
}))

server.listen(port)

console.log(`Koa server started.`)
console.log(`Listening on port:\n — ${port}`)

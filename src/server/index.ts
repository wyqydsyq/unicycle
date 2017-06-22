// server dependencies
import * as koa from 'koa'
import * as send from 'koa-send'
import * as serve from 'koa-static'
import * as mount from 'koa-mount'
import * as bodyParser from 'koa-bodyparser'
import * as waterline from 'koa-waterline'
import * as Disk from 'sails-disk'

// client dependencies
import { run } from '@cycle/run'
import { makeHTTPDriver } from '@cycle/http'
import { makeHTMLDriver } from '@cycle/html'
import { makeServerHistoryDriver } from '@cycle/history'
import { timeDriver } from '@cycle/time'
import switchPath from 'switch-path'

// load the app, routes, boilerplate and models
import ApiRoutes from './routes'
import ClientRoutes from '../client/routes'
import Main from '../client/main'
import Boilerplate from './boilerplate'
import Models from './models'

// configure Koa
const server = new koa()
const port = process.env.PORT || 8080

// development mode
if (process.env.NODE_ENV === 'development') {
  console.log('Development: Mounting WDS and HMR middlewares...')

  const webpack = require('webpack')
  const ClientConfig = require('../../config/webpack/client.js')
  const compiler = webpack(ClientConfig)

  server.use(require('koa-webpack-dev-middleware')(compiler, ClientConfig.devServer))
  server.use(require('koa-webpack-hot-middleware')(compiler))
}

// serve static assets
server.use(mount('/sw.js', (ctx: koa.context) => send(ctx, 'build/static/sw.js', {})))
server.use(mount('/static', serve('build/static')))

// use waterline middleware for API handlers
server.use(waterline({
  adapters: {
    disk: Disk
  },
  connections: {
    simple: {
      adapter: 'disk'
    }
  },
  defaults: {
    migrate: (process.env.NODE_ENV === 'development') ? 'alter' : 'safe'
  },
  models: Models
}))

// use bodyParser so API endpoints can read POSTed data
server.use(bodyParser())

// match any api routes to their respective handler
server.use(mount('/api', async (ctx: koa.context, next: Function) => {
  const { value: Handler } = switchPath(ctx.path, ApiRoutes)
  if (Handler) {
    // call the handler with ctx and next, allowing it to behave like middleware
    await Handler(ctx, next)
  } else {
    next()
  }
}))

// serve the app
server.use(async (ctx: koa.context, next: Function) => new Promise((res, rej) => {
  const { value: Page } = switchPath(ctx.path, ClientRoutes)
  if (Page) {
    // wrap the app's DOM sink with the HTML boilerplate
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
    next()
    return res(false)
  }
}))

server.listen(port)

console.log(`
  Koa server started
    — Port: ${port}
`)

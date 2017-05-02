import { setup } from '@cycle/run'
import { makeHTTPDriver } from '@cycle/http'
import { makeDOMDriver } from '@cycle/dom'
import { makeHistoryDriver } from '@cycle/history'
import { timeDriver } from '@cycle/time'
import switchPath from 'switch-path'

import ClientRoutes from './routes'
import Main from './main'

// register ServiceWorker
require('offline-plugin/runtime').install()

const { rerunner, restartable } = require('cycle-restart')

// configure rerunner with desired drivers. Rerunner will automatically add Time
const run = rerunner(setup, () => ({
  DOM: restartable(makeDOMDriver('#main'), {pauseSinksWhileReplaying: false}),
  HTTP: restartable(makeHTTPDriver()),
  History: makeHistoryDriver()
}))

// run the app!
run(Main)

// handle HMR change events
if (module['hot']) {
  module['hot'].accept('./main', () => {
    const reloaded = require('./main').default

    // call run again with the new app source
    run(reloaded)
  })
}

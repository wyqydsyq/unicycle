import switchPath from 'switch-path'

import Example from './example'

export const Blacklist = {
  '/favicon.ico': null,
  '/__webpack_hmr': null,
  '/sw.js': null
}

export const Routes = {
  '/example': Example,
  ...Blacklist
}

export default Routes

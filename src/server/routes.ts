import Users from './endpoints/users'

export const Blacklist = {
  '/favicon.ico': null,
  '/__webpack_hmr': null,
  '/sw.js': null
}

export const Routes = {
  '/users': {
    '/': Users(undefined),
    '/:id': (id: string) => Users(id)
  },
  ...Blacklist
}

export default Routes

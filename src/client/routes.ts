import Home from './pages/home'
import Timer from './pages/timer'
import NotFound from './pages/notfound'

import Blacklist from '../server/routes'

export const ClientRoutes = {
  '/': NotFound,
  '/home': Home,
  '/timer': Timer,
  ...Blacklist
}

export default ClientRoutes

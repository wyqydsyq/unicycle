import xs from 'xstream'
import { div } from '@cycle/dom'

import Menu from '../components/menu'
import HelloTimer from '../components/helloTimer'

export const Timer = (sources) => ({
  DOM: xs.combine(
    Menu(sources).DOM,
    HelloTimer(sources).DOM
  ).map(([menu, content]) => {
    return div([menu, content])
  })
})

export default Timer

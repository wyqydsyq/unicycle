import xs from 'xstream'
import { div } from '@cycle/dom'

import Menu from '../components/menu'
import HelloTimer from '../components/helloTimer'

export default function Timer(sources) {
  return {
    DOM: xs.combine(
      Menu(sources).DOM,
      HelloTimer(sources).DOM
    ).map(([menu, content]) => {
      return div([menu, content])
    })
  }
}

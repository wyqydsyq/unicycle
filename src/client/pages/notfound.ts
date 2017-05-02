import xs from 'xstream'
import { div, a, p } from '@cycle/dom'

import { classes, Styles } from '../styles'
import Menu from '../components/menu'

export default function NotFound(sources) {

  const content$ = xs.of(div({class: classes(Styles.Hero)}, [
    p('Page not found.'),
    a({attrs: {href: '/home'}}, 'Click here to return home')
  ]))

  return {
    DOM: xs.combine(
      Menu(sources).DOM,
      content$
    ).map(([menu, content]) => {
      return div([menu, content])
    })
  }
}

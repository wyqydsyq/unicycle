import xs from 'xstream'
import { ul, li, a } from '@cycle/dom'
import { style as css} from 'typestyle'

import { classes } from '../../styles'
import Styles from './styles'

export default function Menu(sources) {
  const links = [
    ['/home', 'Home'],
    ['/timer', 'Timer']
  ]

  const VTree$ = ul('.menu', {class: classes(Styles.Menu)},
    links.map(([href, text]) =>
      li({class: classes(Styles.MenuItem)}, [
        a({class: classes(Styles.MenuLink), attrs: {href}}, text)
      ])
    )
  )

  return {
    DOM: xs.of(VTree$)
  }
}

import xs from 'xstream'
import { ul, li, a } from '@cycle/dom'
import { style as css} from 'typestyle'

import { classes } from '../../styles'
import Styles from './styles'

const links = [
  ['/home', 'Home'],
  ['/timer', 'Timer']
]

export const Menu = (sources) => ({
  DOM: xs.of(
    ul('.menu', {class: classes(Styles.Menu)},
      links.map(([href, text]) =>
        li({class: classes(Styles.MenuItem)}, [
          a({class: classes(Styles.MenuLink), attrs: {href}}, text)
        ])
      )
    )
  )
})

export default Menu

import xs from 'xstream'
import { div } from '@cycle/dom'

import { classes, Styles } from '../styles'
import Menu from '../components/menu'

export default function Home(sources) {
  const request$ = xs.of({
    url: '/api/example',
    category: 'api'
  })

  const response$ = sources.HTTP.select('api').map(res$ => res$.replaceError(err => console.log(err))).flatten()

  const content$ = response$
    .map(res => {
      return res.text
    })
    .map(text => div({class: classes(Styles.Hero)}, text))

  return {
    DOM: xs.combine(
      Menu(sources).DOM,
      content$
    ).map(([menu, content]) => {
      return div([menu, content])
    }),
    HTTP: request$
  }
}

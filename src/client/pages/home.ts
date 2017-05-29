import xs from 'xstream'
import { div } from '@cycle/dom'

import { classes, Styles } from '../styles'
import Menu from '../components/menu'

export const Home = (sources) => {
  const request$ = xs.of({
    url: '/api/users',
    category: 'api'
  })

  const response$ = sources.HTTP
    .select('api')
    .map(res$ =>
      res$.replaceError(e => console.error(e))
    )
    .flatten()

  const content$ = response$
    .map(res => {
      return `XHR Response: ${res.text}`
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

export default Home

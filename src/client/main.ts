import xs from 'xstream'
import switchPath from 'switch-path'

import ClientRoutes from './routes'

export default function Main(sources) {

  // define routes
  const route$ = sources.History.map(route => {
    const { value: Page } = switchPath(route.pathname, ClientRoutes)
    return Page(sources)
  })

  // map clicks on links to history events
  const navigate$ = sources.DOM
    .select('a')
    .events('click')
    .map(ev => {
      ev.preventDefault()
      return ev.target.pathname
    })

  return {
    DOM: route$.map(Page => Page.DOM).flatten(),
    HTTP: route$.map(Page => Page.HTTP || xs.empty()).flatten(),
    History: xs.merge(
      // client-side redirect to /home if path is /
      ((typeof window !== 'undefined' && window.location.pathname === '/')
        ? xs.of('/home')
        : ((typeof window !== 'undefined')
          ? xs.of(window.location.pathname)
          : xs.empty()
        )
      ), navigate$
    )
  }
}

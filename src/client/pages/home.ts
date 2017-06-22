import xs from 'xstream'
import { div } from '@cycle/dom'

import { classes, Styles } from '../styles'

import Menu from '../components/menu'
import User from '../components/user'

export const Home = (sources) => {

  // map submits of createUser form to API POST requests
  const userData$ = sources.DOM
    .select('.setUser')
    .events('submit')
    .map(ev => {
      ev.preventDefault()
      const data = new FormData(ev.target)
      return {
        url: `/api/users/${data.get('id') || ''}`,
        category: 'api',
        method: 'POST',
        send: data
      }
    })
    .startWith({
      url: '/api/users',
      category: 'api'
    })

  const response$ = sources.HTTP
    .select('api')
    .map(res$ =>
      res$.replaceError(e => xs.of({ error: e.message }))
    )
    .flatten()

  // build a list of interactive user forms
  const userList$ = response$

    // map each userData object into a User component
    .map(res => res.body.map(user => User({ ...sources, user$: xs.of(user) }).DOM))

    // combine the array of User component DOM sinks and render them in a list container
    .map(userDOM => xs.combine(...userDOM)
      .map(elements => div('.userList', elements))
    )

    // flatten the stream (responses) of streams (User DOM outputs)
    // to a single stream (userList DOM outputs)
    .flatten()

    // default starting value prior to recieving an API response
    .startWith(div('Nothing yet.'))

  // combine all the streams that are used in final DOM output
  const VTree$ = xs.combine(
    Menu(sources).DOM,
    xs.of(div({class: classes(Styles.Hero)}, 'Unicycle example')),

    // blank User component for "new user" form
    User(sources).DOM,

    // list of forms to edit existing users
    userList$
  )

  // render the DOM results of combined streams inside a container
  .map(([menu, content, userCreator, userList]) => {
    return div([
      menu,
      content,
      userCreator,
      userList
    ])
  })

  return {
    DOM: VTree$,
    HTTP: userData$
  }
}

export default Home

import xs from 'xstream'
import { div } from '@cycle/dom'
import * as Form from 'form-to-json'

import { classes, Styles } from '../styles'

import Menu from '../components/menu'
import User from '../components/user'

export const Home = (sources) => {
  const fetchUsers = {
    url: '/api/users',
    category: 'api:user'
  }

  // map submits of createUser form to API POST requests
  const userData$ = sources.DOM
    .select('.setUser')
    .events('submit')
    .map(ev => {
      ev.preventDefault()
      const { id, ...data } = Form(ev.target).toJson()
      return {
        url: `/api/users/${id || ''}`,
        category: 'api:user',
        method: 'POST',
        send: data
      }
    })
    .startWith(fetchUsers)

  const response$ = sources.HTTP
    .select('api:user')
    .map(res$ =>
      res$.replaceError(e => xs.of({ error: e.message }))
    )
    .flatten()

  // build a list of interactive user forms
  const userList$ = response$

    // only use data from GET responses
    .filter(res => res.req.method === 'GET')

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

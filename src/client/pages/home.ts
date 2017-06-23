import xs from 'xstream'
import isolate from '@cycle/isolate'
import { div } from '@cycle/dom'

import { classes, Styles } from '../styles'

import Menu from '../components/menu'
import User from '../components/user'

export const Home = (sources) => {
  const fetchUsers = {
    url: '/api/users',
    category: 'api:user'
  }

  const response$ = sources.HTTP
    .select('api:user')
    .map(res$ =>
      res$.replaceError(e => xs.of({ error: e.message }))
    )
    .flatten()

  const userData$ = response$.filter(res => res.req.method === 'GET')

  const resetForm$ = response$
    .filter(res => res.req.method === 'POST')
    .mapTo({})
    .startWith({})

  const NewUserForm = isolate(User)({ ...sources, user$: resetForm$ })

  // build a list of interactive user forms
  const userList$ = userData$

    // map each userData object into a User component
    .map(res => res.body.map(user => isolate(User)({ ...sources, user$: xs.of(user) })))

    // combine the array of User component DOM sinks and render them in a list container
    .map(users => xs.combine(...users.map(user => user.DOM))
      .map(elements => div('.userList', elements))
    )

    // default starting value prior to recieving an API response
    .startWith(div('Nothing yet.'))

  // combine all the streams that are used in final DOM output
  const VTree$ = xs.combine(
    Menu(sources).DOM,
    xs.of(div({class: classes(Styles.Hero)}, 'Unicycle example')),

    // blank User component for "new user" form
    // NewUserForm.DOM,

    // list of forms to edit existing users
    userList$
  )

  // render the DOM results of combined streams inside a container
  .map(([menu, content, userList]) => {
    return div([
      menu,
      content,
      userList
    ])
  })

  return {
    DOM: VTree$,
    HTTP: xs.merge(

      // initial data fetch and user-initiated requests
      userData$,

      // userCreator requests
      NewUserForm.submit$,

      // map responses of user-initiated POST requests to another data fetch
      response$.filter(res => res.req.method === 'POST').mapTo(fetchUsers)
    ).startWith(fetchUsers)
  }
}

export default Home

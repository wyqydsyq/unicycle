import xs , { Stream } from 'xstream'
import { form, input, button } from '@cycle/dom'

// import { classes } from '../../styles'
// import Styles from './styles'

export interface UserData extends Stream<{}> {
  id?: number
  name?: string
}

export interface Sources {
  user$?: UserData
}

export const User = (sources: Sources) => {
  const values$ = (sources.user$ || xs.of({})).map(
    (user: UserData) => ({
      id: (user && user.id) ? user.id : 0,
      name: (user && user.name) ? user.name : ''
    })
  )

  return {
    DOM: values$.map(user =>
      form('.setUser', { key: user.id }, [
        input({ attrs: {
          type: 'hidden',
          name: 'id',
          value: user.id
        } }),
        input({
          attrs: {
            name: 'name',
            value: user.name
          }
        }),
        button(['Save'])
      ])
    )
  }
}

export default User

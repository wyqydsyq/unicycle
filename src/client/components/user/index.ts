import xs, { Stream } from 'xstream'
import { DOMSource, form, input, button } from '@cycle/dom'
import * as Form from 'form-to-json'

export interface UserData extends Stream<{}> {
  id?: number
  name?: string
}

export interface Sources {
  DOM: DOMSource
  user$: UserData
}

export const User = (sources: Sources) => {
  const data$ = sources.user$
    .map(
      (user: UserData) => ({
        id: (user && user.id) ? user.id : 0,
        name: (user && user.name) ? user.name : ''
      })
    )

  const input$ = sources.DOM
    .select('.setUser input')
    .events('input')

  // current values = provided data with input values merged over top
  const values$ = xs
    .combine(data$, input$)
    .map(([data, event]: [any, any]) => ({
      ...data,
      ...((event)
        ? { [event.target.name]: event.target.value }
        : {}
      )
    }))

  return {
    DOM: values$.map(user =>
      form('.setUser', { key: user.id }, [
        input({
          attrs: {
            type: 'hidden',
            name: 'id',
            value: user.id
          }
        }),
        input({
          attrs: {
            name: 'name',
            value: user.name
          }
        }),
        button(['Save'])
      ])
    ),
    submit$: sources.DOM
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
  }
}

export default User

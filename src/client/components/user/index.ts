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

const intent = (sources) => ({

  // recieve user data values
  user$: sources.user$
    .map((user: UserData) => ({
      id: (user && user.id) ? user.id : 0,
      name: (user && user.name) ? user.name : ''
    })),

  input$: sources.DOM
    .select('.setUser input')
    .events('input'),

  submitClick$: sources.DOM
    .select('.setUser')
    .events('submit')
})

const model = (sources) => ({
  values$: xs
    .combine(sources.user$, sources.input$)
    .map(([userData, event]: [any, any]) => ({
      ...userData,
      ...((event)
        ? { [event.target.name]: event.target.value }
        : {}
      )
    })),

  submit$: sources.submitClick$
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
})

export const User = (sources: Sources) => {
  const events = intent(sources)
  const { values$, submit$ } = model(events)
  return {
    submit$,
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
    )
  }
}

export default User

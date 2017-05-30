import xs from 'xstream'
import { form, input, button } from '@cycle/dom'

// import { classes } from '../../styles'
// import Styles from './styles'

export const User = (sources) => ({
  DOM: xs.of(
    form('.setUser', [
      input({
        attrs: {
          name: 'name'
        }
      }),
      button(['Save'])
    ])
  )
})

export default User

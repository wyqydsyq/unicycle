import xs from 'xstream'
import { div } from '@cycle/dom'

import { classes, Styles as GlobalStyles } from '../../styles'

export const HelloTimer = (sources) => ({
  DOM: sources.Time.periodic(1000)
    .startWith(0)
    .map(elapsed => div({class: classes(GlobalStyles.Hero)}, `🕐 ${elapsed} seconds have elapsed`))
})

export default HelloTimer

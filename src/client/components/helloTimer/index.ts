import xs from 'xstream'
import { div } from '@cycle/dom'

import { classes, Styles as GlobalStyles } from '../../styles'

export default function HelloTimer(sources) {
  const timer$ = sources.Time.periodic(1000)

  return {
    DOM: timer$
      .startWith(0)
      .map(elapsed => div({class: classes(GlobalStyles.Hero)}, `🕐 ${elapsed} seconds have elapsed`))
  }
}

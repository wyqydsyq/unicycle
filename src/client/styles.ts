import { style as css, getStyles } from 'typestyle'

export namespace Styles {
  export const Body = css({
    fontFamily: 'Droid Sans, Helvetica, Arial, sans-serif',
    background: '#51686f',
    color: '#fff',
    textShadow: '0 1px 0 rgba(0, 0, 0, .5);'
  })

  export const Hero = css({
    textAlign: 'center',
    fontSize: '2em',
    fontWeight: 'bold'
  })

  export const render = getStyles
}

export function classes(...args) {
  return args.reduce((acc, x) => {
    acc[x] = true
    return acc
  }, {})
}

export default Styles

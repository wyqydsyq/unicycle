import { style as css } from 'typestyle'

export namespace Styles {
  export const Menu = css({
    listStyle: 'none',
    padding: '0',
    margin: '0'
  })

  export const MenuItem = css({
    display: 'inline-block',
    padding: '0 5px'
  })

  export const MenuLink = css({
    color: '#fff',
    textDecoration: 'none'
  })
}

export default Styles

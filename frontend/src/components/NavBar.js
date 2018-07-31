import PropTypes from 'prop-types'
import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { compose } from 'ramda'
import { withHandlers, withStateHandlers } from 'recompose'
import { withRouter } from 'react-router-dom'

const propTypes = {
  currentMenuAnchor: PropTypes.node.isRequire,
  handleCloseMenu: PropTypes.func.isRequired,
  handleOpenMenu: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  navigateToLogin: PropTypes.func.isRequired,
  navigateToLogout: PropTypes.func.isRequired,
  navigateToSignup: PropTypes.func.isRequired
}

const enhance = compose(
  withRouter,
  withStateHandlers(
    {
      currentMenuAnchor: null,
      isMenuOpen: false
    },
    {
      handleOpenMenu: () => event => ({
        currentMenuAnchor: event.currentTarget,
        isMenuOpen: true
      }),
      handleCloseMenu: () => () => ({
        currentMenuAnchor: null,
        isMenuOpen: false
      })
    }
  ),
  withHandlers({
    closeMenuAndNavigate: props => (path) => {
      props.handleCloseMenu()
      props.history.push(path)
    }
  }),
  withHandlers({
    navigateToLogin: props => () => props.closeMenuAndNavigate('/login'),
    navigateToLogout: props => () => props.closeMenuAndNavigate('/logout'),
    navigateToSignup: props => () => props.closeMenuAndNavigate('/signup')
  })
)

const NavBar = props => (
  <AppBar position='static' color='default'>
    <Toolbar>
      <IconButton color='inherit' onClick={props.handleOpenMenu}>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={props.currentMenuAnchor}
        open={props.isMenuOpen}
        onClose={props.handleCloseMenu}
      >
        {props.isLoggedIn &&
          <React.Fragment>
            <MenuItem onClick={props.navigateToLogout}>Logout</MenuItem>
          </React.Fragment>
        }
        {!props.isLoggedIn &&
          <React.Fragment>
            <MenuItem onClick={props.navigateToLogin}>Login</MenuItem>
            <MenuItem onClick={props.navigateToSignup}>Signup</MenuItem>
          </React.Fragment>
        }
      </Menu>
      <Typography variant='title' color='inherit'>
        Crytter
      </Typography>
    </Toolbar>
  </AppBar>
)

NavBar.propTypes = propTypes
export default enhance(NavBar)

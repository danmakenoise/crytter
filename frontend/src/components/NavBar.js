import PropTypes from 'prop-types'
import React from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import { compose } from 'ramda'
import { withHandlers, withStateHandlers } from 'recompose'
import { withRouter } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const propTypes = {
  currentMenuAnchor: PropTypes.object,
  handleCloseMenu: PropTypes.func.isRequired,
  handleOpenMenu: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  myUsername: PropTypes.string.isRequired,
  navigateToHome: PropTypes.func.isRequired,
  navigateToLogin: PropTypes.func.isRequired,
  navigateToLogout: PropTypes.func.isRequired,
  navigateToSent: PropTypes.func.isRequired,
  navigateToSignup: PropTypes.func.isRequired
}

const styles = {
  root: {
    flexGrow: 1
  },
  appTitle: {
    cursor: 'pointer',
    flexGrow: 1,
    marginLeft: 20
  }
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
        currentMenuAnchor: event.target,
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
    navigateToHome: props => () => props.closeMenuAndNavigate('/'),
    navigateToLogin: props => () => props.closeMenuAndNavigate('/login'),
    navigateToLogout: props => () => props.closeMenuAndNavigate('/logout'),
    navigateToSignup: props => () => props.closeMenuAndNavigate('/signup'),
    navigateToSent: props => () => props.closeMenuAndNavigate('/sent')
  }),
  withStyles(styles)
)

const NavBar = props => (
  <div styles={styles.root}>
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
          {props.isLoggedIn && [
            <MenuItem key='home' onClick={props.navigateToHome}>Home</MenuItem>,
            <MenuItem key='sent' onClick={props.navigateToSent}>Sent Messages</MenuItem>,
            <MenuItem key='logout' onClick={props.navigateToLogout}>Logout</MenuItem>
          ]}
          {!props.isLoggedIn && [
            <MenuItem key='login' onClick={props.navigateToLogin}>Login</MenuItem>,
            <MenuItem key='signup' onClick={props.navigateToSignup}>Signup</MenuItem>
          ]}
        </Menu>
        <span onClick={props.navigateToHome} style={styles.appTitle}>
          <Typography variant='title' color='inherit'>
            Crytter
          </Typography>
        </span>
        <Typography variant='subheading' color='inherit' style={styles.flexGrow}>
          {props.isLoggedIn
            ? <span>Signed In As: <em>{props.myUsername}</em></span>
            : <span>Signed Out</span>
          }
        </Typography>
      </Toolbar>
    </AppBar>
  </div>
)

NavBar.propTypes = propTypes
export default enhance(NavBar)

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
  currentMenuAnchor: PropTypes.node.isRequire,
  handleCloseMenu: PropTypes.func.isRequired,
  handleOpenMenu: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  myUsername: PropTypes.string.isRequired,
  navigateToLogin: PropTypes.func.isRequired,
  navigateToLogout: PropTypes.func.isRequired,
  navigateToSignup: PropTypes.func.isRequired
}

const styles = {
  root: {
    flexGrow: 1
  },
  appTitle: {
    flexGrow: 1,
    marginLeft: 20
  },
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
        <Typography variant='title' color='inherit' style={styles.appTitle}>
          Crytter
        </Typography>
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

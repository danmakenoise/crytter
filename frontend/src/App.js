import PropTypes from 'prop-types'
import React from 'react'
import { compose } from 'ramda'
import { lifecycle, withHandlers, withState } from 'recompose'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'

import NavBar from './components/NavBar'
import Home from './components/Home'
import Login from './components/Login'
import Logout from './components/Logout'
import Signup from './components/Signup'

import { getMe } from './services/user'

const propTypes = {
  isLoaded: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  myUsername: PropTypes.string.isRequired,
  renderHome: PropTypes.func.isRequired,
  renderLogin: PropTypes.func.isRequired,
  renderLogout: PropTypes.func.isRequired,
  renderSignup: PropTypes.func.isRequired,
  setIsLoaded: PropTypes.func.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
  setMyUsername: PropTypes.func.isRequired
}

const renderView = Component => props => routeProps =>
  <Component {...props} {...routeProps} />

const enhance = compose(
  withState(
    'isLoaded',
    'setIsLoaded',
    false
  ),
  withState(
    'isLoggedIn',
    'setIsLoggedIn',
    false
  ),
  withState(
    'myUsername',
    'setMyUsername',
    ''
  ),
  withHandlers({
    renderHome: renderView(Home),
    renderLogin: renderView(Login),
    renderLogout: renderView(Logout),
    renderSignup: renderView(Signup)
  }),
  lifecycle({
    componentDidMount () {
      getMe()
        .then(res => res.json())
        .then(({ username = '' }) => {
          if (!username) {
            window.localStorage.clear()
          }

          this.props.setMyUsername(username)
          this.props.setIsLoggedIn(!!username)
          this.props.setIsLoaded(true)
        })
    }
  })
)

const App = props => props.isLoaded && (
  <Router>
    <div className='App'>
      <NavBar {...props} />
      <Switch>
        {!props.isLoggedIn && [
          <Route path='/login' render={props.renderLogin} />,
          <Route path='/signup' render={props.renderSignup} />,
          <Redirect exact from='/' to='/login' />
        ]}
        {props.isLoggedIn && [
          <Route path='/' exact render={props.renderHome} />,
          <Route path='/logout' render={props.renderLogout} />
        ]}
      </Switch>
    </div>
  </Router>
)

App.propTypes = propTypes
export default enhance(App)

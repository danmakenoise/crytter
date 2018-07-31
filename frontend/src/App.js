import PropTypes from 'prop-types'
import React from 'react'
import { withState } from 'recompose'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import NavBar from './components/NavBar'
import Home from './components/Home'
import Login from './components/Login'
import Logout from './components/Logout'
import Signup from './components/Signup'

const propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
}

const enhance = withState(
  'isLoggedIn',
  'setIsLoggedIn',
  Boolean(window.localStorage.getItem('isLoggedIn'))
)

const App = props => (
  <Router>
    <div className='App'>
      <NavBar />
      <Route path='/' exact component={Home} />
      {!props.isLoggedIn && [
        <Route path='/login' component={Login} />,
        <Route path='/signup' component={Signup} />
      ]}
      {props.isLoggedIn &&
        <Route path='/logout' component={Logout} />
      }
    </div>
  </Router>
)

App.propTypes = propTypes
export default enhance(App)

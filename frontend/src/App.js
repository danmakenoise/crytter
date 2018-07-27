import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import AppBar from 'material-ui/AppBar'

import Home from './components/Home'
import Login from './components/Login'
import Logout from './components/Logout'
import Signup from './components/Signup'

import './App.css'

class App extends Component {
  render () {
    const isLoggedIn = window.localStorage.getItem('isLoggedIn')

    return (
      <MuiThemeProvider>
        <Router>
          <div className='App'>
            <AppBar
              title='Crytter'
            />
            <ul>
              {!isLoggedIn &&
                <li>
                  <Link to='/login'>Login</Link>
                </li>
              }
              {!isLoggedIn &&
                <li>
                  <Link to='/signup'>Signup</Link>
                </li>
              }
              {isLoggedIn &&
                <li>
                  <Link to='/'>Home</Link>
                </li>
              }
              {isLoggedIn &&
                <li>
                  <Link to='/logout'>Logout</Link>
                </li>
              }
            </ul>
            <div className='App__Frame'>
              <Route path='/' exact component={Home} />
              {!isLoggedIn &&
                <Route path='/login' component={Login} />
              }
              {!isLoggedIn &&
                <Route path='/signup' component={Signup} />
              }
              {isLoggedIn &&
                <Route path='/logout' component={Logout} />
              }
            </div>
          </div>
        </Router>
      </MuiThemeProvider>
    )
  }
}

export default App

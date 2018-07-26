import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'

class App extends Component {
  render () {
    const isLoggedIn = window.localStorage.getItem('isLoggedIn')

    return (
      <Router>
        <div className='App'>
          <h1>Crytter</h1>
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
          </ul>
          <Route path='/' exact component={Home} />
          {!isLoggedIn &&
            <Route path='/login' component={Login} />
          }
          {!isLoggedIn &&
            <Route path='/signup' component={Signup} />
          }
        </div>
      </Router>
    )
  }
}

export default App

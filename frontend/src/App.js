import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'

class App extends Component {
  render () {
    return (
      <Router>
        <div className='App'>
          <h1>Crytter</h1>
          <ul>
            <li>
              <Link to='/login'>Login</Link>
            </li>
            <li>
              <Link to='/signup'>Signup</Link>
            </li>
          </ul>
          <Route path='/' exact component={Home} />
          <Route path='/login' component={Login} />
          <Route path='/signup' component={Signup} />
        </div>
      </Router>
    )
  }
}

export default App

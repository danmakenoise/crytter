import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import Signup from './components/Signup'

class App extends Component {
  render () {
    return (
      <Router>
        <div className='App'>
          <h1>Crytter</h1>
          <ul>
            <li>
              <Link to='/signup'>Signup</Link>
            </li>
          </ul>
          <Route path='/signup' component={Signup} />
        </div>
      </Router>
    )
  }
}

export default App

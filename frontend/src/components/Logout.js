import React, { Component } from 'react'
import { logout } from '../services/session'

class Logout extends Component {
  componentDidMount () {
    logout()
      .then(() => {
        window.localStorage.clear()
        window.location = '/'
      })
  }

  render () {
    return (
      <h2>Logging Out...</h2>
    )
  }
}

export default Logout

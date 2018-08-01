import React from 'react'
import { lifecycle } from 'recompose'
import { logout } from '../services/session'

const enhance = lifecycle({
  componentDidMount () {
    logout()
      .then(() => {
        window.localStorage.clear()
        window.location = '/'
      })
  }
})

const Logout = () => (
  <h2>Logging Out...</h2>
)

export default enhance(Logout)

import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router-dom'

const propTypes = {
  myUsername: PropTypes.string.isRequired
}

const Login = props => (
  <div>
    <h2>Home</h2>
    <p>Coming soon...</p>
  </div>
)

Login.propTypes = propTypes
export default withRouter(Login)

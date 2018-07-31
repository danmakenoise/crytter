import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router-dom'

const propTypes = {
  myUsername: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired
}

const Login = props => (
  props.isLoading ? <h1>Loading...</h1> : (
    <div>
      <h2>Home</h2>
      <h3>{props.myUsername}</h3>
    </div>
  )
)

Login.propTypes = propTypes
export default withRouter(Login)

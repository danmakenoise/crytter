import PropTypes from 'prop-types'
import React from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import { compose } from 'ramda'
import { withHandlers, withState, withStateHandlers } from 'recompose'
import { withRouter } from 'react-router-dom'

import { login } from '../services/session'

const propTypes = {
  formError: PropTypes.string.isRequired,
  formUsername: PropTypes.string.isRequired,
  formPassword: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  setFormErrors: PropTypes.func.isRequired,
  setFormPassword: PropTypes.func.isRequired,
  setFormUsername: PropTypes.func.isRequired
}

const setFromEventValue = prop => event => ({
  [prop]: event.target.value
})

const enhance = compose(
  withRouter,
  withState('formError', 'setFormError', ''),
  withStateHandlers(
    {
      formUsername: '',
      formPassword: ''
    },
    {
      setFormUsername: () => setFromEventValue('formUsername'),
      setFormPassword: () => setFromEventValue('formPassword')
    }
  ),
  withHandlers({
    handleSubmit: props => (event) => {
      event.preventDefault()

      const username = props.formUsername
      const password = props.formPassword

      login({ username, password })
        .then((res) => {
          if (res.status === 200) {
            window.localStorage.setItem('isLoggedIn', true)
            window.location = '/'
          } else {
            props.setFormError('Invalid Login')
          }
        })
    }
  })
)

const Signup = props => (
  <div>
    <h2>Login</h2>
    <form onSubmit={props.handleSubmit}>
      <label htmlFor='loginUsername'>Username:
        <input
          type='text'
          name='loginUsername'
          onChange={props.setFormUsername}
          value={props.formUsername}
        />
      </label>

      <label htmlFor='loginPassword'>Password:
        <input
          type='password'
          name='loginPassword'
          onChange={props.setFormPassword}
          value={props.formPassword}
        />
      </label>

      <button>Login</button>
    </form>

    {!!props.formError && (
      <div>
        <h3>Error:</h3>
        {props.formError}
      </div>
    )}
  </div>
)

Signup.propTypes = propTypes
export default enhance(Signup)

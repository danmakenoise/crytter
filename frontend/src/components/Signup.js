import PropTypes from 'prop-types'
import React from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import { compose } from 'ramda'
import { withHandlers, withState, withStateHandlers } from 'recompose'
import { withRouter } from 'react-router-dom'

import { signupUser } from '../services/user'

const propTypes = {
  formErrors: PropTypes.arrayOf(PropTypes.string).isRequired,
  formUsername: PropTypes.string.isRequired,
  formPassword: PropTypes.string.isRequired,
  formPasswordConfirm: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  setFormErrors: PropTypes.func.isRequired,
  setFormPassword: PropTypes.func.isRequired,
  setFormPasswordConfirm: PropTypes.func.isRequired,
  setFormUsername: PropTypes.func.isRequired
}

const setFromEventValue = prop => event => ({
  [prop]: event.target.value
})

const enhance = compose(
  withRouter,
  withState('formErrors', 'setFormErrors', []),
  withStateHandlers(
    {
      formUsername: '',
      formPassword: '',
      formPasswordConfirm: ''
    },
    {
      setFormUsername: () => setFromEventValue('formUsername'),
      setFormPassword: () => setFromEventValue('formPassword'),
      setFormPasswordConfirm: () => setFromEventValue('formPasswordConfirm')
    }
  ),
  withHandlers({
    handleSubmit: props => (event) => {
      event.preventDefault()

      const username = props.formUsername
      const password = props.formPassword
      const passwordConfirm = props.formPasswordConfirm

      signupUser({ username, password, passwordConfirm })
        .then((errors) => {
          if (errors) {
            props.setFormErrors(errors)
            return
          }

          props.history.push('/login')
        })
    }
  })
)

const Signup = props => (
  <div>
    <h2>Signup</h2>
    <form onSubmit={props.handleSubmit}>
      <label htmlFor='signupUsername'>Username:
        <input
          type='text'
          name='signupUsername'
          value={props.formUsername}
          onChange={props.setFormUsername}
        />
      </label>

      <label htmlFor='signupPassword'>Password:
        <input
          type='password'
          name='signupPassword'
          value={props.formPassword}
          onChange={props.setFormPassword}
        />
      </label>

      <label htmlFor='signupConfirmPassword'>Confirm Password:
        <input
          type='password'
          name='signupConfirmPassword'
          value={props.formPasswordConfirm}
          onChange={props.setFormPasswordConfirm}
        />
      </label>

      <button>Signup</button>
    </form>

    {!!props.formErrors.length && (
      <div>
        <h3>Errors:</h3>

        <ul>
          {props.formErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)

Signup.propTypes = propTypes
export default enhance(Signup)

import React, { Component } from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router-dom'
import { signupUser } from '../services/user'

const propTypes = {
  history: ReactRouterPropTypes.history.isRequired
}

class Signup extends Component {
  constructor (props) {
    super(props)

    this.$username = React.createRef()
    this.$password = React.createRef()
    this.$passwordConfirm = React.createRef()

    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      errors: []
    }
  }

  handleSubmit (event) {
    event.preventDefault()

    const username = this.$username.current.value
    const password = this.$password.current.value
    const passwordConfirm = this.$passwordConfirm.current.value

    signupUser({ username, password, passwordConfirm })
      .then((errors) => {
        if (errors) {
          this.setState({ errors })
          return
        }

        this.props.history.push('/login')
      })
  }

  render () {
    return (
      <div>
        <h2>Signup</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='signupUsername'>Username:
            <input type='text' name='signupUsername' ref={this.$username} />
          </label>

          <label htmlFor='signupPassword'>Password:
            <input type='password' name='signupPassword' ref={this.$password} />
          </label>

          <label htmlFor='signupConfirmPassword'>Confirm Password:
            <input type='password' name='signupConfirmPassword' ref={this.$passwordConfirm} />
          </label>

          <button>Signup</button>
        </form>

        {!!this.state.errors.length && (
          <div>
            <h3>Errors:</h3>

            <ul>
              {this.state.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
}

Signup.propTypes = propTypes
export default withRouter(Signup)

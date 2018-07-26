import React, { Component } from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router-dom'
import { login } from '../services/session'

const propTypes = {
  history: ReactRouterPropTypes.history.isRequired
}

class Login extends Component {
  constructor (props) {
    super(props)

    this.$username = React.createRef()
    this.$password = React.createRef()

    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      error: ''
    }
  }

  handleSubmit (event) {
    event.preventDefault()

    const username = this.$username.current.value
    const password = this.$password.current.value

    login({ username, password })
      .then((res) => {
        if (res.status === 200) {
          window.localStorage.setItem('isLoggedIn', true)
          window.location = '/'
        } else {
          this.setState({
            error: 'Invalid login'
          })
        }
      })
  }

  render () {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='loginUsername'>Username:
            <input type='text' name='loginUsername' ref={this.$username} />
          </label>

          <label htmlFor='loginPassword'>Password:
            <input type='password' name='loginPassword' ref={this.$password} />
          </label>

          <button>Login</button>
        </form>

        {!!this.state.error && (
          <div>
            <h3>Error:</h3>
            {this.state.error}
          </div>
        )}
      </div>
    )
  }
}

Login.propTypes = propTypes
export default withRouter(Login)

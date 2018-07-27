import React, { Component } from 'react'

import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'

import { login } from '../services/session'

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

    const username = this.$username.current.input.value
    const password = this.$password.current.input.value

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
        <form>
          <TextField
            fullWidth
            hintText='Username'
            ref={this.$username}
          />

          <TextField
            fullWidth
            hintText='Password'
            ref={this.$password}
            type='password'
          />

          <FlatButton
            label='Login'
            onClick={this.handleSubmit}
          />
        </form>

        <Snackbar
          autoHideDuration={4000}
          message={this.state.error}
          open={!!this.state.error}
        />
      </div>
    )
  }
}

export default Login

import React, { Component } from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router-dom'
import { getMe } from '../services/user'

const propTypes = {
  history: ReactRouterPropTypes.history.isRequired
}

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      username: ''
    }
  }

  componentDidMount () {
    getMe()
      .then(res => res.json())
      .then(({ username }) => {
        if (username) {
          this.setState({ username })
          return
        }

        this.props.history.push('/login')
      })
  }

  render () {
    return !this.state.username ? <h1>Loading...</h1> : (
      <div>
        <h2>Home</h2>
        <h3>{this.state.username}</h3>
      </div>
    )
  }
}

Login.propTypes = propTypes
export default withRouter(Login)

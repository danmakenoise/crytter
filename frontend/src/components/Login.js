import PropTypes from 'prop-types'
import React from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import { compose } from 'ramda'
import { withHandlers, withStateHandlers } from 'recompose'
import { withRouter } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import { login } from '../services/session'

const propTypes = {
  formUsername: PropTypes.string.isRequired,
  formPassword: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  navigateToSignup: PropTypes.func.isRequired,
  setFormPassword: PropTypes.func.isRequired,
  setFormUsername: PropTypes.func.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired
}

const styles = {
  container: {
    width: '350px',
    margin: '24px auto'
  }
}

const setFromEventValue = prop => event => ({
  [prop]: event.target.value
})

const enhance = compose(
  withStyles(styles),
  withRouter,
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
            props.setSnackbarMessage('Invalid Login')
          }
        })
    },
    navigateToSignup: props => () => props.history.push('/signup')
  })
)

const Login = props => (
  <Grid item xs={12}>
    <form onSubmit={props.handleSubmit}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Typography variant='title'>Login</Typography>
        </Grid>
        <Grid item xs={12}>
          <Input
            fullWidth
            type='text'
            name='loginUsername'
            onChange={props.setFormUsername}
            placeholder='Username'
            value={props.formUsername}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            fullWidth
            type='password'
            name='loginPassword'
            onChange={props.setFormPassword}
            placeholder='Password'
            value={props.formPassword}
          />
        </Grid>
        <Grid item xs={6}>
          <Button color='primary' type='submit'>Login</Button>
        </Grid>
        <Grid item xs={6}>
          <Button onClick={props.navigateToSignup}>Don't have an account?</Button>
        </Grid>
      </Grid>
    </form>
  </Grid>
)

Login.propTypes = propTypes
export default enhance(Login)

import PropTypes from 'prop-types'
import React from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import { compose } from 'ramda'
import { withHandlers, withState, withStateHandlers } from 'recompose'
import { withRouter } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import { signupUser } from '../services/user'

const propTypes = {
  formUsername: PropTypes.string.isRequired,
  formPassword: PropTypes.string.isRequired,
  formPasswordConfirm: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  setFormPassword: PropTypes.func.isRequired,
  setFormPasswordConfirm: PropTypes.func.isRequired,
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
            props.setSnackbarMessage(errors.join(', '))
            return
          }

          props.setSnackbarMessage('Account created! You may now login.')
          props.history.push('/login')
        })
    }
  })
)

const Signup = props => (
  <Grid item xs={12}>
    <form onSubmit={props.handleSubmit}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Typography variant='title'>Signup</Typography>
        </Grid>
        <Grid item xs={12}>
          <Input
            fullWidth
            name='signupUsername'
            onChange={props.setFormUsername}
            placeholder='Username'
            type='text'
            value={props.formUsername}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            fullWidth
            name='signupPassword'
            onChange={props.setFormPassword}
            placeholder='Password'
            type='password'
            value={props.formPassword}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            fullWidth
            name='signupConfirmPassword'
            onChange={props.setFormPasswordConfirm}
            placeholder='Password Confirmation'
            type='password'
            value={props.formPasswordConfirm}
          />
        </Grid>
        <Grid item xs={6}>
          <Button color='primary' type='submit'>Signup</Button>
        </Grid>
      </Grid>
    </form>
  </Grid>
)

Signup.propTypes = propTypes
export default enhance(Signup)

import PropTypes from 'prop-types'
import React from 'react'
import { compose } from 'ramda'
import { withHandlers, withState, withStateHandlers, lifecycle } from 'recompose'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import Typography from '@material-ui/core/Typography'

import { getMessages, sendMessage } from '../services/message'

const propTypes = {
  formMessage: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  myUsername: PropTypes.string.isRequired,
  setFormMessage: PropTypes.func.isRequired,
  setMessages: PropTypes.func.isRequired
}

const enhance = compose(
  withState(
    'messages',
    'setMessages',
    []
  ),
  withStateHandlers(
    {
      formMessage: ''
    },
    {
      setFormMessage: () => (event) => ({
        formMessage: event.target.value
      })
    }
  ),
  withHandlers({
    loadMessages: props => () => getMessages().then((messages) => {
      props.setMessages(messages)
    }),
    handleSubmit: props => () => sendMessage({
      message: props.formMessage,
      recipientUsername: props.myUsername
    })
  }),
  lifecycle({
    componentDidMount () {
      this.props.loadMessages()
    }
  })
)

const Home = props => (
  <Grid item xs={12}>
    <Typography variant='title'>Home</Typography>
    <Grid container spacing={24}>
      {props.messages.map((message, index) => (
        <Grid key={index} item xs={6}>
          <Typography variant='display1'>{message.message}</Typography>
          <Typography variant='body1'>From: {message.senderUsername}</Typography>
        </Grid>
      ))}
    </Grid>
    <form onSubmit={props.handleSubmit}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Typography variant='body2'>Send A Message</Typography>
          <Typography variant='body1'>You can only send messages to yourself for now.</Typography>
        </Grid>
        <Grid item xs={12}>
          <Input
            fullWidth
            type='text'
            name='message'
            onChange={props.setFormMessage}
            placeholder='Message'
            value={props.formMessage}
          />
        </Grid>
        <Grid item xs={12}>
          <Button color='primary' type='submit'>Send</Button>
        </Grid>
      </Grid>
    </form>
  </Grid>
)

Home.propTypes = propTypes
export default enhance(Home)

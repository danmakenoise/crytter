import PropTypes from 'prop-types'
import React from 'react'
import { compose } from 'ramda'
import { withHandlers, withState, lifecycle } from 'recompose'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { getSentMessages } from '../services/message'

const propTypes = {
  formMessage: PropTypes.string.isRequired,
  formRecipient: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  myUsername: PropTypes.string.isRequired,
  setFormMessage: PropTypes.func.isRequired,
  setFormRecipient: PropTypes.func.isRequired,
  setMessages: PropTypes.func.isRequired
}

const enhance = compose(
  withState(
    'messages',
    'setMessages',
    []
  ),
  withHandlers({
    loadMessages: props => () => getSentMessages().then((messages) => {
      props.setMessages(messages)
    })
  }),
  lifecycle({
    componentDidMount () {
      this.props.loadMessages()
    }
  })
)

const Sent = props => (
  <Grid item xs={12}>
    <Typography variant='title'>Sent</Typography>
    <Grid container spacing={24}>
      {props.messages.map((message, index) => (
        <Grid key={index} item xs={6}>
          <Typography variant='display1'>{message.message}</Typography>
          <Typography variant='body1'>To: {message.recipientUsername}</Typography>
        </Grid>
      ))}
    </Grid>
  </Grid>
)

Sent.propTypes = propTypes
export default enhance(Sent)

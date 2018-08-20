import PropTypes from 'prop-types'
import React from 'react'
import { compose } from 'ramda'
import { withState, lifecycle } from 'recompose'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { getMessages } from '../services/message'

const propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  myUsername: PropTypes.string.isRequired,
  setMessages: PropTypes.func.isRequired
}

const enhance = compose(
  withState(
    'messages',
    'setMessages',
    []
  ),
  lifecycle({
    componentDidMount () {
      getMessages().then((messages) => {
        this.props.setMessages(messages)
      })
    }
  })
)

const Home = props => (
  <Grid item xs={12}>
    <Typography variant='title'>Home</Typography>
    <Grid container spacing={24}>
      {props.messages.map(message => (
        <Grid item xs={6}>
          <Typography variant='display1'>{message.message}</Typography>
          <Typography variant='body1'>From: {message.senderUsername}</Typography>
        </Grid>
      ))}
    </Grid>
  </Grid>
)

Home.propTypes = propTypes
export default enhance(Home)

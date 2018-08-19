import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router-dom'

const propTypes = {
  myUsername: PropTypes.string.isRequired
}

const Home = props => (
  <div>
    <h2>Home</h2>
    <p>Coming soon...</p>
  </div>
)

Home.propTypes = propTypes
export default withRouter(Home)

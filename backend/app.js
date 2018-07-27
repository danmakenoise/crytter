const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const logger = require('morgan')
const session = require('express-session')

const SequelizeStore = require('connect-session-sequelize')(session.Store)

const db = require('./models')
const sessionsController = require('./controllers/sessions')
const usersController = require('./controllers/users')

const app = express()

app.use(bodyParser.json())
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}))
app.use(logger('dev'))
app.use(session({
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365
  },
  resave: false,
  secret: process.env.SESSION_SECRET || 'crytter-dev',
  store: new SequelizeStore({
    db: db.sequelize,
    table: 'Session'
  })
}))

app.post('/login', sessionsController.login)

app.get('/users/me', usersController.me)
app.post('/users', usersController.create)

module.exports = app

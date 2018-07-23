const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const logger = require('morgan')
const session = require('express-session')

const SequelizeStore = require('connect-session-sequelize')(session.Store)

const db = require('./models')
const usersController = require('./controllers/users')

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(logger('dev'))
app.use(session({
  secret: process.env.SESSION_SECRET || 'crytter-dev',
  store: new SequelizeStore({
    db: db.sequelize,
    resave: false,
    table: 'Session'
  })
}))

app.post('/users', usersController.create)

module.exports = app

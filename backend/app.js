const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')

const usersController = require('./controllers/users')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())

app.post('/users', usersController.create)

module.exports = app

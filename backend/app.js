const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())

module.exports = app

'use strict'

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const { handleError } = require('./helpers/error')

console.log({ inputFile: process.env.npm_config_inputFile })

//Import route files
const travelRoutes = require('./routes/travelRoutes')

//Data parsers for the request body
app.use(express.json())

//Allowing CORS to FRONTEND requests in another domain
app.use(cors())

//Log responses to console
app.use(morgan('dev'))

//Log all requests to access.log
app.use(morgan('combined', {
	stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
		flags: 'a'
	})
}))

//Define the route files here
app.use('/api', travelRoutes)

//Error handling
app.use((err, req, res, next) => {
  handleError(err, res)
})

//Starts the application server
const port = 8080
app.listen(port, function () {
	console.log('Server running at: http://localhost:' + port)
})

module.exports = app

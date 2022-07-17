const express = require('express')
const logger = require('morgan')
const createError = require('http-errors')
const helmet = require('helmet')
const cors = require('cors')
const esg = require('express-swagger-generator')

const defaultOptions = require('./swagger.json')
const {Post, Comment} = require('./routers')

const options = Object.assign(defaultOptions, {basedir: __dirname})

const app = express()
const expressSwagger = esg(app)
expressSwagger(options)

app.use(cors())
app.use(helmet())

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(logger(process.env.NODE_ENV || 'dev'))

Post.use('/', Comment)
app.use('/v1/posts', Post)

app.use(function(req, res, next){
  const err = createError(404)
  next(err)
})

app.use(function(error, req, res, next){
  console.log(error)
    if (error.name && error.name === 'ValidationError') {
      res.status(406).json(error)
    } else if ((error.status && error.status === 400) || error.name && error.name === 'CastError') {
      res.status(404).json({
        url: req.originalUrl,
        error: {
          message: 'Not Found'
        }
      })
    } else {
      res.status(error.status || 500).json({
        url: req.originalUrl,
        error
      })
    }
})

module.exports = app
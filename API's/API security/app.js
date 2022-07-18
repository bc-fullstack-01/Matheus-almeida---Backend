const express = require('express')
const logger = require('morgan')
const createError = require('http-errors')
const helmet = require('helmet')
const cors = require('cors')
const esg = require('express-swagger-generator')

const jwt = require('jsonwebtoken')
const ACCESS_TOKEN_SECRET = 'testtoken'

const defaultOptions = require('./swagger.json')
const {Post, Comment, User} = require('./routers')
const {User: UserModel} = require('./models')

const options = Object.assign(defaultOptions, {basedir: __dirname})

const app = express()
const expressSwagger = esg(app)
expressSwagger(options)

app.use(cors())
app.use(helmet())

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(logger(process.env.NODE_ENV || 'dev'))

function authenticateToken (req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return next(createError(401))
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return next(createError(403))
    UserModel.findOne({user})
      .then( u => {
        req.user = u
        next()
      })
  })
}

Post.use('/', authenticateToken, Comment)
app.use('/v1/posts', authenticateToken, Post)
app.use('/v1/users', User)

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
    } else if (error.code === 11000) {
      res.status(500).json({
        url: req.originalUrl,
        error: {
          message: 'Duplicate key not allowed'
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
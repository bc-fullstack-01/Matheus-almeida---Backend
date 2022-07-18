const createError = require('http-errors')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const {User, Connection} = require('../models')
const ACCESS_TOKEN_SECRET  = 'testtoken'

router
  .route('/')
  .all((req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() =>{
      next()
    })
    .catch(err => next(err))
  )
/**
 * This function list the users
 * @route GET / users
 * @group User - api
 * @returns {User} 200 - An array of user info
 * @returns {Error} default - Unexpected error
 * @security JWT
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => User.find({}))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err))
  )
/**
 * This function creates a user
 * @route POST /users
 * @param {User.model} post.body.required - te new user
 * @group User - api
 */
  .post((req, res, next) => Promise.resolve()
    .then(() => bcrypt.hash(req.body.password, 10))
    .then((passHashed) => new User({ ...req.body, password: passHashed}).save())
    .then((data) => res.status(201).json(data))
    .catch(err => next(err)))
/**
 * Ths function make the login
 * @route POST /users/login
 * @param {User.model} user.body.required - just user and password
 * @group User - api
 */
router
  .route('/login')
  .post((req, res, next) => Promise.resolve()
    .then(() => User.findOne({ user: req.body.user}))
    .then((user) => user ? bcrypt.compare(req.body.password, user.password) : next(createError(404)))
    .then((passHashed) => passHashed ? jwt.sign(req.body.user, ACCESS_TOKEN_SECRET) : next(createError(401)))
    .then((accessToken) => res.status(201).json({accessToken}))
    .catch(err => next(err)))

router
  .param('id', (req, res, next, id) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => {
      next()
    })
    .catch(err => next(err))
  )
  .route('/:id')
  .get((req, res, next) => Promise.resolve()
    .then(() => User.findById(req.params.id).populate({path: 'comments'}))
    .then((data) => data ? res.status(200).json(data) : next(createError(404)))
    .catch(err => next(err)))
  .put((req, res, next) => Promise.resolve()
    .then(() => User.findByIdAndUpdate(req.params.id, req.body, {runValidators: true}))
    .then((data) => res.status(203).json(data))
    .catch(err => next(err)))
  .delete((req, res, next) => Promise.resolve()
    .then(() => User.deleteOne({ _id: req.params.id}))
    .then((data) => res.status(203).json(data))
    .catch(err => next(err)))

module.exports = router
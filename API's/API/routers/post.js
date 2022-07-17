const createError = require('http-errors')
const express = require('express')
const router = express.Router()
const {Post, Connection} = require('../models')

router
  .route('/')
  .all((req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => {
      next()
    })
    .catch(err => next(err))
  )
/**
 * This function comment is parsed by doctrine
 * @route GET /posts
 * @group Post - api
 * @returns {Post} 200 - An array of user info
 * @returns {Error} default - Unexpected error
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => Post.find({}).populate('comments'))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err))
  )
/**
 * This function comment is parsed by doctrine
 * sdfkjsldfkj
 * @route POST /posts
 * @param {Post.model} post.body.required - the new point
 * @group Post - api
 * @param {string} title.query.required - username or email
 * @param {string} description.query.required - user's password
 */
  .post((req, res, next) => Promise.resolve()
    .then(() => new Post(req.body).save())
    .then((data) => res.status(201).json(data))
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
    .then(() => Post.findById(req.params.id).populate({path: 'comments'}))
    .then((data) => data ? res.status(200).json(data) : next(createError(404)))
    .catch(err => next(err)))
  .put((req, res, next) => Promise.resolve()
    .then(() => Post.findByIdAndUpdate(req.params.id, req.body, {runValidators: true}))
    .then((data) => res.status(203).json(data))
    .catch(err => next(err)))
  .delete((req, res, next) => Promise.resolve()
    .then(() => Post.deleteOne({_id: req.params.id}))
    .then((data) => res.status(203).json(data))
    .catch(err => next(err)))

  module.exports = router
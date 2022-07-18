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
 * This function get posts
 * @route GET /posts
 * @group Post - api
 * @returns {Array.<Post>} 200 - An array of posts
 * @returns {Error} default - Unexpected error
 * @security JWT
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => Post.find({ user: req.user._id}).populate('comments'))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err))
  )
/**
 * This function get posts
 * @route POST /posts
 * @param {Post.model} post.body.required - the new point
 * @group Post - api
 * @security JWT
 */
  .post((req, res, next) => Promise.resolve()
    .then(() => new Post({...req.body, user: req.user._id}).save())
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
/**
 * This function to get a post by id
 * @route GET /posts/{id}
 * @param {string} id.path.required - user's id
 * @group Post - api
 * @returns {<Post>} 200 - post
 * @security JWT
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => Post.findById(req.params.id).populate({path: 'comments'}))
    .then((data) => data ? res.status(200).json(data) : next(createError(404)))
    .catch(err => next(err)))
/**
 * This function to get a post by id
 * @route PUT /posts/{id}
 * @param {Post.models} post.body.required - the new point
 * @param {string} id.path.required - user's id.
 * @group Post - api
 * @security JWT
 */
  .put((req, res, next) => Promise.resolve()
    .then(() => Post.findByIdAndUpdate(req.params.id, req.body, {runValidators: true}))
    .then((data) => res.status(203).json(data))
    .catch(err => next(err)))
/**
 * This function to get a post bu id
 * @route DELETE /posts/{id}
 * @param {string} id.path.required - user's id.
 * @group Post - api
 * @security JWT
 */
  .delete((req, res, next) => Promise.resolve()
    .then(() => Post.deleteOne({_id: req.params.id}))
    .then((data) => res.status(203).json(data))
    .catch(err => next(err)))

  module.exports = router
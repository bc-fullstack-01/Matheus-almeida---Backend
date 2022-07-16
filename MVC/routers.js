const express = require('express')

const {
  PostController,
  CommentController
} = require('./controllers')

//Definindo grupos de rotas posts
const router = express.Router()
router
  .route('/posts')//define a rota '/posts'
  .all(PostController.beforeAll) 
  .get(PostController.list) 
  .post(PostController.add)
router
  .route('/posts/new')//define a rota '/posts/new'
  .get(PostController.new)
router
  .param('id', PostController.beforeById)
  .route('/posts/:id')//define a rota '/posts/:id'
  .get(PostController.show)
  .put(PostController.save)
  .delete(PostController.delete)
router
  .param('id', PostController.beforeById)
  .route('/posts/:id/edit')//define a rota '/posts/:id/edit'
  .get(PostController.edit)

//definindo grupos de rotas comments
const nRouter = express.Router()
nRouter
  //define a rota '/:postId/comments'
  .param('postId', CommentController.beforeAllById)
  .route('/:postId/comments')
  .all(CommentController.beforeAll)
  .get(CommentController.list)
  .post(CommentController.add)
nRouter
  //define a rota '/:postId/comments/new'
  .route('/:postId/comments/new')
  .get(CommentController.new)
nRouter
  //define a rota '/:postId/comments/:id'
  .param('id', CommentController.beforeById)
  .route('/:postId/comments/:id')
  .get(CommentController.show)
  .put(CommentController.save)
  .delete(CommentController.delete)
nRouter
  //define a rota '/:postId/comments/:id/edit'
  .param('id', CommentController.beforeById)
  .route('/:postId/comments/:id/edit')
  .get(CommentController.edit)

router.use('/posts', nRouter)

module.exports = router
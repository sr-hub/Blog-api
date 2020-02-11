// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for comments
const Post = require('../models/post')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else

// const requireOwnership = customErrors.requireOwnership
const requireCommentOwnership = customErrors.requireCommentOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { comment: { title: '', text: 'foo' } } -> { comment: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /comments
// router.get('/comments', (req, res, next) => {
//   Comment.find()
//   // populating user and post subdocs
//     .populate('user')
//     .populate('post')
//     .then(comments => {
//       // `comments` will be an array of Mongoose documents
//       // we want to convert each one to a POJO, so we use `.map` to
//       // apply `.toObject` to each one
//       return comments.map(comment => comment.toObject())
//     })
//     // respond with status 200 and JSON of the comments
//     .then(comments => res.status(200).json({ comments: comments }))
//     // if an error occurs, pass it to the handler
//     .catch(next)
// })
//
// // SHOW
// // GET /comments/5a7db6c74d55bc51bdf39793
// router.get('/comments/:id', (req, res, next) => {
//   // req.params.id will be set based on the `:id` in the route
//   Comment.findById(req.params.id)
//     .populate('user')
//     .populate('post')
//     .then(handle404)
//     // if `findById` is succesful, respond with 200 and "comment" JSON
//     .then(comment => res.status(200).json({ comment: comment.toObject() }))
//     // if an error occurs, pass it to the handler
//     .catch(next)
// })

// CREATE
// POST /comments
router.post('/comments', requireToken, (req, res, next) => {
  // set owner of new comment to be current user
  req.body.comment.author = req.user.id

  Post.findById(req.body.comment.post)
    .then(post => {
      post.comments.push(req.body.comment)
      return post.save()
    })
    .then(post => {
      // console.log('save response is ', post)
      res.status(201).json({ post: post.toObject() })
    })
    // Comment.create(req.body.comment)
    //   // respond to succesful `create` with status 201 and JSON of new "comment"
    //   .then(comment => {
    //     res.status(201).json({ comment: comment.toObject() })
    //   })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /comments/5a7db6c74d55bc51bdf39793
router.patch(
  '/comments/:postId/:commentId',
  requireToken,
  removeBlanks,
  (req, res, next) => {
    // if the client attempts to change the `owner` property by including a new
    // owner, prevent that by deleting that key/value pair
    delete req.body.comment.owner

    const postId = req.params.postId
    // .id
    const commentId = req.params.commentId
    // .cmnt
    Post.findById(postId)
      .then(handle404)
      .then(post => {
        requireCommentOwnership(req, post.comments.id(commentId))
        post.comments.id(commentId).set(req.body.comment)
        return post.save()
      })
      .then(() => res.sendStatus(204))
      // if an error occurs, pass it to the handler
      .catch(next)
  }
)

// DESTROY
// DELETE /comments/5a7db6c74d55bc51bdf39793

router.delete(
  '/comments/:postId/:commentId',
  requireToken,
  (req, res, next) => {
    // ('/posts/:postId/comments/:commrntId')
    // /comments/:id/:cmnt

    // const _id = req.user.id
    // req.body.comment.author = req.user.id
    const postId = req.params.postId
    // .id
    const commentId = req.params.commentId
    // .cmnt
    Post.findById(postId)
    // add handle404
      .then(post => {
        requireCommentOwnership(req, post.comments.id(commentId))
        post.comments.id(commentId).remove()
        return post.save()
      })
      .then(post => {
      // console.log('save response is ', post)
        res.status(204).json({ post: post.toObject() })
      })
    // comment
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
      .catch(next)
  })

module.exports = router

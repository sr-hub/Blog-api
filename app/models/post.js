const mongoose = require('mongoose')
const commentSchema = require('./comment')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  // editable: {
  //   type: Boolean
  // },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [commentSchema]
  // comments: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Comment'
  // }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Post', postSchema)

// {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'Comment',
//   required: true
// }

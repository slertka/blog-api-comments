'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var authorSchema = mongoose.Schema({
  firstName: 'string',
  lastName: 'string',
  userName: {
    type: 'string',
    unique: true
  }
});

var commentSchema = mongoose.Schema({ content: 'string' });

var blogpostSchema = mongoose.Schema({
  title: 'string',
  content: 'string',
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
  comments: [commentSchema]
});

blogpostSchema.pre('find', function(next) {
  this.populate('author');
  next();
})

blogpostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`;
})

blogpostSchema.methods.serialize = function () {
  return {
    id: this._id,
    title: this.title,
    author: this.authorName,
    content: this.content,
    comments: this.comments,
    created: new Date()
  }
}

var Author = mongoose.model('Author', authorSchema);
const BlogPost = mongoose.model('BlogPost', blogpostSchema);

module.exports = { BlogPost, Author };
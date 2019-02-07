const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  userName: { 
    type: String, 
    unique: true
  }
})

const blogpostSchema = mongoose.Schema({
  title: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
  content: { type: String }
})

const commentSchema = mongoose.Schema({
  content: { type: String }
});

blogpostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`;
})

blogpostSchema.methods.serialize = function () {
  return {
    id: this._id,
    title: this.title,
    author: this.authorName,
    content: this.content,
    comments: [commentSchema],
    created: new Date()
  }
}

const { Author } = mongoose.model('Author', authorSchema);
const { Blogpost } = mongoose.model('Blogpost', blogpostSchema);

module.exports = { Blogpost }
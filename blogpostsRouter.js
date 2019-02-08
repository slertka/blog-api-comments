const express = require('express');
const router = express.Router();

const { BlogPost , Author } = require('./models');

router.use(express.json());

// GET /post request
router.get('/', (req, res) => {
  BlogPost.find()
    .then(blogpost => res.json({
      blogPosts: blogpost.map(post => post.serialize())
    }))
    .catch(err => {
      console.log(err);
      res.status(500).json({message: `Internal server error`})
    })
})

// GET /post/:id 
router.get('/:id', (req, res) => {
  BlogPost.findById(req.params.id)
    .populate('author')
    .then(blogpost => res.json({
      blogPosts: blogpost.serialize()
    }))
    .catch(err => {
      console.log(err);
      res.status(500).json({message: `Internal server error`})
    })
  }
)

// POST request
router.post('/', (req, res) => {
  // verify req.body contains 'title', 'content', and 'userName'
  const requiredFields = ['title', 'content', 'author_id'];
  for (let i=0; i<requiredFields.length; i++) {
    let field = requiredFields[i];
    if (!(field in req.body)) {
      res.status(404).json({message: `Request is missing ${field} in body`})
    }
  };

  // Verify 'author' doesn't already exist
  Author.findById(req.body.author_id)
    .then(author => {
      // If author exists then make a new blog post
      if (author) {
        BlogPost.create({
          title: req.body.title,
          content: req.body.content,
          author: req.body.author_id
        })
        .then(blog => 
          res.status(201).json({
            BlogPost: {
              title: blog.title,
              content: blog.content,
              author: `${author.firstName} ${author.lastName}`
            }
          }))
      } else {
        // Send error message if author doesn't exist
        res.status(400).json({message: `Author does not exist`})
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: `Internal server error`})
    })
});

// PUT request
// only allow update of 'title' and 'content'
router.put('/:id', (req, res) => {
  // check if requested _id param matches body _id param
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({message: `The request parameter id ${req.params.id} must match the request body id ${req.body.id}`});
  }

  // check that only 'title' and 'content' can be updated
  // note id cannot be updated but is a required body param
  const updatableFields = ['title', 'content', 'id'];
  const bodyKeys = Object.keys(req.body);
  for (let i=0; i<bodyKeys.length; i++) {
    const bodyKey = bodyKeys[i];
    if (!(updatableFields.includes(bodyKey))) {
      res.status(400).json({message: `${bodyKey} is not an updatable field. Valid fields are 'title' and 'content'`})
    }
  }

  // update blog post
  BlogPost.findByIdAndUpdate(req.params.id, { $set: req.body })
    .populate('author')
    .then(blog => {res.status(200).json({
      title: req.body.title,
      content: req.body.content,
      author: blog.authorName,
      created: new Date()
    })})
    .catch(err => {
      console.log(err);
      res.status(400).json({message: `Internal server error`});
    })
})

module.exports = router
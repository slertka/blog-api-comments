const express = require('express');
const router = express.Router();

const { BlogPost , Author } = require('./models');

router.use(express.json());

// GET /post request
// Use a .pre() hook with the .populate() method to make all the blog posts look the same
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

module.exports = router
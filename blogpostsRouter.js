const express = require('express');
const router = express.Router();

const { Blogpost } = require('./models')

router.use(express.json());

// GET /post request
// Use a .pre() hook with the .populate() method to make all the blog posts look the same
router.get('/', (req, res) => {
  
})

module.exports = router
const express = require('express');
const router = express.Router();

const { Author } = require('./models');

router.use(express.json());

router.post('/', (req, res) => {
  // verify request body contains 'firstName', 'lastName', and 'userName'
  const requiredFields = ['firstName', 'lastName', 'userName'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      res.status(400).json({message: `Request body is missing required key ${field}.`})
    }
  }

  // verify username doesn't already exist
  Author.findOne({ userName: req.body.userName })
    .then(author => {
      if (author) {
        res.status(400).json({message: `Username already taken`});
      } else {
        Author.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userName: req.body.userName
        })
        .then(author => {
          res.status(201).json({
            _id: author.id,
            name: `${req.body.firstName} ${req.body.lastName}`,
            userName: author.userName
          })
          }
        )
      }
    })
})

module.exports = router;
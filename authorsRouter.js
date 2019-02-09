const express = require('express');
const router = express.Router();

const { Author, BlogPost } = require('./models');

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

router.put('/:id', (req, res) => {
  // verify id params match
  if (!(req.body.id && req.params.id && req.params.id === req.body.id)) {
    res.status(400).json({message: `The request body id ${req.body.id} must match the request param id ${req.params.id}`});
  }

  // verify keys are correct
  const updatableFields = ['firstName', 'lastName', 'userName', 'id'];
  const bodyKeys = Object.keys(req.body);
  for (let i=0; i<bodyKeys.length; i++) {
    const bodyKey = bodyKeys[i];
    if (!(updatableFields.includes(bodyKey))) {
      res.status(400).json({message: `The request body key ${bodyKey} is not valid. Valid keys are 'firstName', 'lastName', or 'userName'.`})
    }
  }

  // verify if username is already taken
  if (req.body.userName) {
    Author.findOne({userName: req.body.userName})
      .then(author => {
        if (author) {
          res.status(400).json({message: `Username already exists`});
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({message: `Internal server error`});
      })
  }

  Author.findById(req.params.id)
    .then(author => {
      Author.findByIdAndUpdate(req.params.id, { $set: req.body })
        .then(updatedAuthor => {
          res.json({
            _id: updatedAuthor.id,
            name: `${req.body.firstName || updatedAuthor.firstName} ${req.body.lastName || updatedAuthor.lastName}`,
            userName: req.body.userName || updatedAuthor.userName
          })
        })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: `Internal server error`})
    })
}) 

router.delete('/:id', (req, res) => {
  // verify request id matches in body and params
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({message: `Request body parameter ${req.body.id} must match request parameter id ${req.params.id}`})
  }

  BlogPost.remove({ author: req.params.id})
    .then(() => {
      Author.findByIdAndDelete(req.params.id)
      .then(res.status(204).end());
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: `Internal server error`})
  })

})

module.exports = router;
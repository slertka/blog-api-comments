const express = require('express');
const router = express.Router();

const { Author } = require('./models');

router.use(express.json());

module.exports = router;
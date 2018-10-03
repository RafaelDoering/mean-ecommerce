const router = require('express').Router();
const User = require('../models/user');
const config = require('../config');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

module.exports = router;

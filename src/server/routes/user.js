const router = require('express').Router();
const User = require('../models/user');
const config = require('../config');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(require('cookie-parser')());

router.post('/register', (req, res) => {
  User.findOne({ name: req.body.name }, (err, existingUser) => {
    if(existingUser){
      return res.json({success: false, message: 'User already exists.'});
    }else{
      bcrypt.genSalt(saltRounds, function(err, salt){
        if(err){
          return res.json({success: false, message: 'Salt error.'});
        }else{
          bcrypt.hash(req.body.password, salt, null, function(err, hash){
            if(err){
              return res.json({success: false, message: 'Hash error.'});
            }else{
              var user = new User();

              user.name = req.body.name;
              user.password = hash;
              user.admin = true;

              user.save((err, newUser) => {
                if(err){
                  return res.json({success: false, message: 'Save error.'})
                }else{
                  const payload = {
                    name: newUser.name,
                    admin: newUser.admin
                  };
                  const token = jwt.sign(payload, config.secret, {expiresIn: '1h'});
                  res.cookie('token', token, {maxAge: 900000, httpOnly: false});
                  return res.redirect('/');
                }
              });
            }
          });
        }
      });
    }
  });
});

router.post('/login', (req, res) => {
  User.findOne({ name: req.body.name }, (err, existingUser) => {
    if(existingUser){
      if(bcrypt.compareSync(req.body.password, existingUser.password)){
        const payload = {
          name: existingUser.name,
          admin: existingUser.admin
        };
        const token = jwt.sign(payload, config.secret, {expiresIn: '1h'});
        res.cookie('token', token, {maxAge: 900000, httpOnly: false});
        return res.redirect('/');
      }else{
        return res.json({success: false, message: 'Incorrect password.'});
      }
    }else{
      return res.json({success: false, message: 'User does not exists.'});
    }
  });
});

router.get('/cookie', (req, res) => {
  res.send(req.cookies.token);
});

module.exports = router;

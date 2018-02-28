'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const createAuthToken = user => {
  console.log(user);
  return jwt.sign({
    user: {
      _id: user._id,
      username: user.username,
      firstName: user.firstName
    }
  }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', { session: false });

router.post('/login', localAuth, (req,res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/info', jwtAuth, (req, res) => {
  console.log(req.user);
  res.json({})
})

router.post('/refresh', jwtAuth, (req,res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = { router };

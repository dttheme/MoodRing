'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const { User } = require('./models');
const localStrategy = require('../auth/strategies');

const router = express.Router();

// const jsonParser = bodyParser.json();

router.post('/', (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
  if(missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if(nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const trimmedFields = ['username', 'password'];
  const nonTrimmedField = trimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizeFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    }
  };

  const tooSmallField = Object.keys(sizeFields).find(
    field => 'min' in sizeFields[field] && req.body[field].trim().length < sizeFields[field].min
  );

  const tooLargeField = Object.keys(sizeFields).find(
    field => 'max' in sizeFields[field] && req.body[field].trim().length > sizeFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
      ? `Must be at least ${sizeFields[tooSmallField].min} characters long`
      : `Cannot be more than ${sizeFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = ''} = req.body;
  firstName = firstName.trim();
  console.log(username, password, firstName);
  return User.find({username})
  .count()
  .then(count => {
    if (count > 0) {
      return Promise.reject({
        code: 422,
        reason: 'ValidationError',
        message: 'username already taken',
        location: 'username'
      });
    }
    return User.hashPassword(password);
  })
  .then(hash => {
    console.log(hash);
    return User.create({
      username,
      password: hash,
      firstName
    })
    .then(user => {
      console.log(user);
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      console.log(err);
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error!'});
    });
  })
});


router.get('/', (req, res) => {
  return User
    .find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};

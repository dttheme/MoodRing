'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const { User } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
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

  const stringField = ['username', 'password', 'firstName'];
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
    field => 'min' in sizeFields[field] && req.body[field].trim().length < sizeFields[field].om
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

  return User.find({username})
  .count()
  .then(count => {
    if (count > 0) {
      return Promise.reject({
        code: 422,
        reason: 'ValidationError',
        message: 'Username already taken',
        location: 'username'
      });
    }
    return User.hashPassword(password);
  })
  .then(hash => {
    return User.create({
      username,
      password: hash,
      firstName
    });
  })
  .then(user => {
    return res.status(201).json(user.serialize());
  })
  .catch(err => {
    if (err.reason === 'ValidationError') {
      return res.status(err.code).json(err);
    }
    res.status(500).json({code: 500, message: 'Internal server error'});
  });
});

router.get('/', (res, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = { router };






































// const strategy = new basicStrategy(
//   (username, password, cb) => {
//     User
//     .findOne({username})
//     .then(user => {
//       if(!user) {
//         return cb(null, false, {
//           message: `Incorrect username`
//         });
//       }
//       if(user.password !== password) {
//         return cb(null, false, `Incorrect password`);
//       }
//       return cb(null, user);
//     })
//     .catch(err => cb(err))
//   });
//
//   passport.use(strategy);
//
//   router.post('/', (req, res) => {
//     if (!req.body) {
//       return res.status(400).json({message: 'No request body'});
//     }
//
//     if (!('username' in req.body)) {
//       return res.status(422).json({message: 'Missing field: username'});
//     }
//         return res.status(422).json({message: 'Incorrect field type: username'});
//     }
//
//     username = username.trim();
//
//     if (username === '') {
//       return res.status(422).json({message: 'Incorrect field length: username'});
//     }
//
//     if(!(password)) {
//       return res.status(411).json({message: 'Missing field: password'});
//     }
//
//     if (typeof password !== 'string') {
//       return res.status(422).json({message: 'Incorrect field type: password'});
//     }
//
//     password = password.trim();
//
//     if (password = '') {
//       return res.status(422).json({message: 'Incorrect field length: password'});
//     }
//
//     //Check for existing user
//     return User
//     .find({username})
//     .count()
//     .then(count => {
//       if(count > 0) {
//         return res.status(422).json({message: 'Username already taken'});
//       }
//       return User.hashPassword(password)
//     })
//     .then(user => {
//       return res.status
//     })
//   })
//     let {username, password, firstName} = req.body;
//
//       return res.status(422).json({message: 'Incorrect field type: username'});
//     }
//
//     username = username.trim();
//
//     if (username === '') {
//       return res.status(422).json({message: 'Incorrect field length: username'});
//     }
//
//     if(!(password)) {
//       return res.status(411).json({message: 'Missing field: password'});
//     }
//
//     if (typeof password !== 'string') {
//       return res.status(422).json({message: 'Incorrect field type: password'});
//     }
//
//     password = password.trim();
//
//     if (password = '') {
//       return res.status(422).json({message: 'Incorrect field length: password'});
//     }
//
//     //Check for existing user
//     return User
//     .find({username})
//     .count()
//     .then(count => {
//       if(count > 0) {
//         return res.status(422).json({message: 'Username already taken'});
//       }
//       return User.hashPassword(password)
//     })
//     .then(user => {
//       return res.status
//     })
//   })  if (typeof username !== 'string') {
//       return res.status(422).json({message: 'Incorrect field type: username'});
//     }
//
//     username = username.trim();
//
//     if (username === '') {
//       return res.status(422).json({message: 'Incorrect field length: username'});
//     }
//
//     if(!(password)) {
//       return res.status(411).json({message: 'Missing field: password'});
//     }
//
//     if (typeof password !== 'string') {
//       return res.status(422).json({message: 'Incorrect field type: password'});
//     }
//
//     password = password.trim();
//
//     if (password = '') {
//       return res.status(422).json({message: 'Incorrect field length: password'});
//     }
//
//     //Check for existing user
//     return User
//     .find({username})
//     .count()
//     .then(count => {
//       if(count > 0) {
//         return res.status(422).json({message: 'Username already taken'});
//       }
//       return User.hashPassword(password)
//     })
//     .then(user => {
//       return res.status
//     })
//   })

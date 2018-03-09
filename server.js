'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const path = require('path');
const passport = require('passport');

const { PORT, DATABASE_URL } = require('./config');

const { Post } = require('./posts/models');
const { User } = require('./users/models');

const {router: userRouter} = require('./users/userRouter');
const {router: postRouter} = require('./posts/postRouter');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('common'));
app.use(express.static('public'));

mongoose.Promise = global.Promise;

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

const authSession = passport.authenticate('jwt', {session: false});

app.use('*', function(req, res) {
  res.status(404).json({ message: 'Not found' });
});

let server;

function runServer(databaseUrl = DATABASE_URL, port) {

  return new Promise ((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port = (process.env.PORT || 8080), () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise(function(resolve, reject) {
      console.log(`Closing server`);
      server.close(err => {
        if(err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if(require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

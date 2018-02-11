'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const path = require('path');

const postRouter = require('./postRouter');

const { PORT, DATABASE_URL } = require('./config');
const { Post } = require('./models');
const { User } = require('./users/models');
const { userRouter } = require('./users/userRouter');

const app = express();

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));

mongoose.Promise = global.Promise;

app.get('/', (req, res) => {
  res.sendFile(__dirname + `/public/index.html`)
})

app.get('/dashboard', (req, res) => {
  //will need login authentification
  res.sendFile(__dirname + `/public/dashboard.html`)
})

app.get('/archive', (req, res) => {
  res.sendFile(__dirname + `/public/archive.html`)
})

app.use('/posts', postRouter);

// app.use('/users', userRouter);

app.use('*', function(req, res) {
  res.status(404).json({ message: 'Not found' });
});

let server;

// Heroku won't deploy: https://stackoverflow.com/questions/14322989/first-heroku-deploy-failed-error-code-h10

function runServer(databaseUrl = DATABASE_URL, port) {

  return new Promise ((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(process.env.PORT || 8080, () => {
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

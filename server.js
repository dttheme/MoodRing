'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const postRouter = require('./postRouter');

const { PORT, DATABASE_URL } = require('./config');
const { Post } = require('./models');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.Promise = global.Promise;

const MOCK_POSTS = {
  "posts": [
    {
      "id": "111",
      "mood": "happy",
      "activity": ["walk", "yoga", "brush teeth"],
      "note": "Today was great!",
      "publishedAt": 1517271600
    },
    {
      "id": "222",
      "mood": "sad",
      "activity": ["clean kitchen", "pet cat", "drink water"],
      "note": "Tomorrow I will take a walk and do yoga!",
      "publishedAt": 1517272183
    },
    {
      "id": "333",
      "mood": "productive",
      "activity": ["walk", "drink tea"],
      "note": "Got a lot done today!",
      "publishedAt": 1517322248
    }
  ]
}

app.get('/', (req, res) => {
  res.send('index.html')
})

app.get('/dashboard', (req, res) => {
  //will need login authentification
  res.send('dashboard.html')
})

app.use('/posts', postRouter);

app.use('*', function(resq, res) {
  res.status(404).json({message: 'Not found'});
});

let server;

function runServer(databaseUrl, port) {

  return new Promise ((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
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

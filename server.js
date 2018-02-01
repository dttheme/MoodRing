'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// const postRouter = require('./postRouter');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { Post } = require('./models');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
// app.use('posts', postRouter);

module.exports = app;

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
  res.send('dashboard.html')
})

app.get('/posts', (req, res) => {
  res.json(MOCK_POSTS);
})

// app.post('/posts', jsonParser ,(req,res) => {
//   const item = {
//     mood: 'happy',
//     activity: ['drink tea', 'make bed', 'pet cat'],
//     note: 'A good day!'
//   };
//   res.status(201).json(item);
// })


let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {

  return new Promise ((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
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

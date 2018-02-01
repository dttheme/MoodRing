'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Post } = require('./models');

router.get('/posts', (req, res) => {
  Post
    .find()
    .then(results => {
      return results.map(result => {
        return result.serialize();
      });
    })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    })
})

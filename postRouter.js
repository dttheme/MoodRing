'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Post } = require('./models');

router.get('/posts', (req, res) => {
  Post
    .find()
    .then(posts => {
      res.json({
        posts: posts.map(
          (post) => post.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/posts', (req, res) => {
  Post
    .create({
      mood: req.body.mood,
      activity: req.body.activity,
      note: req.body.note,
    })
    .then(post => res.status(201).json(restaurant.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' })
    })
})

router.put('/posts/:id', (req, res) => {
  const toUpdate = {};
  const updateableFields = ['mood', 'activity', 'note'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Post
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
  then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/posts:id', (req, res) => {
  Post
    .findByIdAndRemove(req.params.id)
    .then(() => {res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = router;

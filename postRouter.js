'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Post } = require('./models');

router.get('/', (req, res) => {
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

router.post('/', (req, res) => {
  Post
    .create({
      rating: req.body.rating,
      mood: req.body.mood,
      activity: req.body.activity,
      note: req.body.note,
    })
    .then(post => res.status(201).json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' })
    })
})

router.put('/:id', (req, res) => {
  const toUpdate = {};
  const updateableFields = ['rating', 'mood', 'activity', 'note'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Post
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
  .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/:id', (req, res) => {
  Post
    .findByIdAndRemove(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = router;

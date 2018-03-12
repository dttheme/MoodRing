'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

mongoose.Promise = global.Promise;

const { Post } = require('./models');

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/', jwtAuth, (req, res) => {
  console.log(req.user);
  Post
    .find({author: req.user._id})
    .sort({createdAt: 'desc'})
    .then(posts => res.json(posts))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/', jwtAuth, (req, res) => {
  const requiredFields = ['rating', 'mood', 'activity'];
      Post
        .create({
          rating: req.body.rating,
          mood: req.body.mood,
          activity: req.body.activity,
          note: req.body.note,
          author: req.user._id
        })
        .then(post => res.status(201).json(post))
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' })
        })
})

router.put('/:id', jwtAuth, (req, res) => {
  const toUpdate = {};
  const updateableFields = ["rating", "mood", "activity", "note"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  console.log(req.body);
  Post
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
  .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/:id', jwtAuth, (req, res) => {
  Post
    .findByIdAndRemove(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = {router};

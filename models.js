'use strict';

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  rating: Number,
  mood: { type: [String], require: true },
  activity: [String],
  note: String,
  publishedAt: { type: Date, default: new Date() }
})

postSchema.methods.serialize = function() {
  return {
    id: this._id,
    rating: this.rating,
    mood: this.mood,
    activity: this.activity,
    note: this.note,
    publishedAt: this.publishedAt
  };
};

const Post = mongoose.model('Post', postSchema);

module.exports = {Post};

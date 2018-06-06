'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const WineSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  varietal: {type: String, default: ''},
  region: {type: String, default: ''},
  country: {type: String, default: ''},
  year: {type: Number},
  rating: {type: Number}
});

WineSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username || '',
    name: this.name || '',
    varietal: this.varietal || '',
    region: this.region || '',
    country: this.country || '',
    year: this.year,
    rating: this.rating 
  };
};

const Wine = mongoose.model('Wine', WineSchema);

const ReviewSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  wine_id: {type: String, default: ''},
  rating: {type: Number},
  publishedAt: {type: Date, default: Date.now},
  title: {type: String, default: ''},
  text: {type: String, default: ''}
});

ReviewSchema.methods.serialize = function() {
  return {
    id: this._id,
    wine_id: this.wine_id,
    username: this.username || '',
    rating: this.rating,
    publishedAt: this.publishedAt,
    title: this.title || '',
    text: this.text || '',
  };
};

const Review = mongoose.model('Review', ReviewSchema);


module.exports = {Wine, Review};

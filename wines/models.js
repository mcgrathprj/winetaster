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
  rating: {type: Number}
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    varietal: this.varietal || '',
    rating: this.rating || ''
  };
};

const Wine = mongoose.model('Wine', WineSchema);

module.exports = {Wine};

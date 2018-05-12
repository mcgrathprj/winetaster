'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

router.use(bodyParser.json());

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.get('/tests', jwtAuth, (req, res) => {
  res.status(200).json({wine:"pinot noir"});
});

module.exports = {router};

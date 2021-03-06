'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const {Wine, Review} = require('./models')
router.use(bodyParser.json());

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.get('/tests', jwtAuth, (req, res) => {
  res.status(200).json({wine:"pinot noir"});
});

module.exports = {router};

router.get('/wines', (req, res) => {
  Wine
    .find()
    .then(wines => {
      res.status(200).json(wines)
    })
    .catch(err=> {
      res.status(500).json({message: "Internal Server Error"});
    });
});

router.get('/wines/:id', (req, res) => {
  Wine
    .findById(req.params.id)
    .then(wine => {
      res.status(200).json(wine)
    })
    .catch(err=> {
      res.status(500).json({message: "Internal Server Error"});
    });
});

router.get('/reviews', (req, res) => {
  Review
    .find()
    .then(reviews => {
      res.status(200).json(reviews)
    })
    .catch(err=> {
      res.status(500).json({message: "Internal Server Error"});
    });
});

router.get('/reviews/:id', (req, res) => {
  Review
    .findById(req.params.id)
    .then(review => {
      res.status(200).json(review)
    })
    .catch(err=> {
      res.status(500).json({message: "Internal Server Error"});
    });
});


router.post('/wines', (req, res) => {
  const requiredFields = ['name', 'username'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message)
    }
  }; 

  Wine
    .create(req.body)
    .then(wine => {
      res.status(201).json(wine)
    })
    .catch(err => {
      res.status(500).json({message: "Internal Server Error"});
    });
});

router.post('/reviews', (req, res) => {
  const requiredFields = ['wine_id', 'rating', 'username'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message)
      }
    }; 

  Review
    .create(req.body)
    .then(review => {
      res.status(201).json(review)
    })
    .catch(err => {
      res.status(500).json({message: "Internal Server Error"});
    })
});

router.delete('/wines/:id', (req, res) => {
  Wine
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => {
      res.status(500).json({message: "Internal Server Error"})
    })
});

router.delete('/reviews/:id', (req, res) => {
  Review
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => {
      res.status(500).json({message: "Internal Server Error"})
    })
});

router.put('/wines/:id', (req, res) => {

  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path ID (${req.params.id}) and request body ID (${req.body.id}) must match`
      );
    console.error(message);
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ["name", "year", "varietal", "country", "region"]

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Wine
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
  .then(() => {
    res.status(204).end()
    })
  .catch(err => {
    res.status(500).json({message: "Internal Error"})
  })
})

router.put('/reviews/:id', (req, res) => {

  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path ID (${req.params.id}) and request body ID (${req.body.id}) must match`
      );
    console.error(message);
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ["rating", "title", "text"]

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Review
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
  .then(() => {
    res.status(204).end()
    })
  .catch(err => {
    res.status(500).json({message: "Internal Error"})
  })
})

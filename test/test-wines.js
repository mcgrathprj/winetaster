'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { Wine } = require('../wines');
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHTTP);

describe('/api/wine', function () {
  const username = 'exampleUser';
  const wine = 'exampleWine';
  const year = 'exampleYear';
  const varietal = 'exampleVarietal';
  const country = 'exampleCountry';
  const region = 'exampleRegion';

describe('/api/review', function () {
  const username = 'exampleUser';
  const title = 'exampleTitle';
  const title = 'exampleText';

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () { });

  afterEach(function () {
    return Wine.remove({});
  });
})

describe('api/wines', function() {
  describe('GET', function() {
    it ('should return an array of wines', function() {
      return Wine.create (
          {
            username,
            wine,
            year,
            varietal,
            country,
            region
          },
          {
            username: usernameB,
            wine: wineB,
            year: yearB,
            varietal: varietalB,
            country: countryB,
            region: regionB
          }
        )
    })
  }) 
});

describe('api/reviews', function() {
  describe('GET', function() {
    it ('should return an array of reviews', function() {
      return Review.create (
      {
        username,
        wine_id,
        rating,
        title, 
        text
      },
      {
        username: usernameB,
        wine_id: wine_idB,
        rating: ratingB,
        title: titleB,
        text: textB
      })
      }
    })
  }) 
})

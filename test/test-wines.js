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
  const type = 'exampleType';
  const country = 'exampleCountry';
  const region = 'exampleRegion';
  const reviews = [
    {
      username:"exampleUser",
      rating: "exampleRating",
      title: "exampleTitle",
      text: "example text"
    }
  ]

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
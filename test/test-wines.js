'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { Wine } = require('../wines');
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHTTP);

describe('/data/wine', function () {
  const username = 'exampleUser';
  const name = 'exampleName';
  const year = 2016;
  const varietal = 'exampleVarietal';
  const country = 'exampleCountry';
  const region = 'exampleRegion';

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () { });

  afterEach(function () {
    return Wine.remove({});

  describe('data/wines', function() {
    describe('GET', function() {
       it('Should return an empty array initially', function () {
          return chai.request(app)
          .get('/data/wines')
          .then(res => { 
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(0);
          });
        });
      it ('should return an array of wines', function() {
        return Wine.create (
          {
            username,
            name,
            year,
            varietal,
            country,
            region
          },
          {
            username: usernameB,
            name: nameB,
            year: yearB,
            varietal: varietalB,
            country: countryB,
            region: regionB
          }
        )
          .then(() => chai.request(app)
            .get('/data/wines'))
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.equal({
              username,
              name,
              year,
              varietal,
              country,
              region
              });
            expect(res.body[1]).to.equal({
              username: usernameB,
              name: nameB,
              year: yearB,
              varietal: varietalB,
              country: countryB,
              region: regionB
              });
            }); 
          })
        }) 
      });
  });

  describe ('/data/wines DELETE', function() {
      it ('should delete items', function() {
        return Wine.create (
          {
            username,
            name,
            year,
            varietal,
            country,
            region
          }
        )
        .then(() => chai.request(app).get('/data/wines'))
        .then(function(res) {
          let id = res.body[0]._id;
        return chai.request(app)
        .delete(`/data/wines/${id}`);
        })
      .then(function(res) {
        expect(res).to.have.status(204);
        });
      })

  describe ('/data/wines/:id GET', function() {
      it ('should get a single wine object', function() {
        return Wine.create (
          {
            username,
            name,
            year,
            varietal,
            country,
            region
          }
        )
        .then(() => chai.request(app).get('/data/wines'))
        .then(function(res) {
          let id = res.body[0]._id;
        return chai.request(app)
        .get(`/data/wines/${id}`);
        })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.length(1);
        });
      })

    })

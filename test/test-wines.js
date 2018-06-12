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
  const wine = 'exampleWine';
  const year = 'exampleYear';
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
          return chai.request(router).get('/data/wines').then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(0);
          });
        });
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
          .then(() => chai.request(router).get('/data/wines'))
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.equal({
              username,
              wine,
              year,
              varietal,
              country,
              region
              });
            expect(res.body[1]).to.equal({
              username: usernameB,
              wine: wineB,
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
});


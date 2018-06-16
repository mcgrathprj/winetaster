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
  describe ('POST /data/wines', function() {
//    describe ('POST', function() {
      let wine = {
          username,
          year,
          varietal,
          country,
          region
        };
      it('should reject wines with missing wine name', function() {
        return chai.request(app)
        .post('/data/wines')
        .send(wine)
        .then (res => { 
          expect(res).to.have.status(400)
        })
      })
    })

      // it('should reject wines with missing username', function() {
      //   return chai.request(app)
      //   .post('data/wines')
      //   .send({
      //     name,
      //     year,
      //     varietal,
      //     country,
      //     region
      //   })
      //   .then (() => 
      //     expect.fail(null, null, 'Request should not succeed')
      //   )
      //   .catch(err => {
      //     if (err instanceof chai.AssertionError) {
      //       throw err;
      //     }
          
      //     const res = err.response;
      //     expect(res).to.have.status(400);
      //     expect(res.body.reason).to.equal('ValidationError');
      //     expect(res.body.message).to.equal('Missing field');
      //     expect(res.body.location).to.equal('username');

      //   })
      // })

  describe ('/data/wines', function() {
//    describe ('DELETE', function() {
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
    })
  //})
});

'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { Review } = require('../wines');
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHTTP);

describe('/data/review', function () {
  const username = 'exampleUser';
  const wine_id = 'exampleWineId';
  const rating = 'exampleRating';
  const title = 'exampleTitle';
  const text = 'exampleText';

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () { });

  afterEach(function () {
    return Review.remove({});

  describe('GET', function() {
     it('Should return an empty array initially', function () {
        return chai.request(router).get('/data/reviews').then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(0);
        });
      });
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
        }
      )
        .then(() => chai.request(router).get('/data/reviews'))
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(2);
          expect(res.body[0]).to.equal({
            username,
            wine_id,
            rating,
            title,
            text
            });
          expect(res.body[1]).to.equal({
            username: usernameB,
            wine_id: wine_idB,
            rating: ratingB,
            title: titleB,
            text: textB
            });
          }); 
        })
      }); 
//    });

  describe ('/data/reviews', function() {
      it ('should delete items', function() {
        return Review.create (
          {
            username,
            wine_id,
            rating,
            title,
            text
          }
        )
        .then(() => chai.request(app).get('/data/reviews'))
        .then(function(res) {
          let id = res.body[0]._id;
        return chai.request(app)
        .delete(`/data/reviews/${id}`);
        })
      .then(function(res) {
        expect(res).to.have.status(204);
        });
      })
    })
  })
});

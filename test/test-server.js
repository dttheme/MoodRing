'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const { Post } = require('../models')
const { app , runServer, closeServer } = require('../server.js');
const { TEST_DATABASE_URL } = require('../config');


chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

function sendTestData() {
  console.info('Sending test data');
  const testData = [];

  for (let i=1; i<=10; i++) {
    console.log(generateTestData());
    testData.push(generateTestData());
  }
  return Post.insertMany(testData);
}

function generateTestData() {
  return {
    mood: faker.random.word(),
    activity: [faker.random.word()],
    note: faker.lorem.sentence(),
    publishedAt: faker.date.recent()
  }
}

function tearDownDb() {
  return new Promise ((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

describe('/', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();;
  });

  it('should return 200 status and HTML', function() {
     return chai.request(app)
    .get('/')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.html;
    });
  });
});

describe('/dashboard', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should return 200 status and HTML', function() {
    return chai.request(app)
    .get('/dashboard')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.html;
    });
  });
});

describe('API Resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return sendTestData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });
  describe('GET endpoint', function() {
    it('should list all existing posts', function() {
      let res;
      return chai.request(app)
      .get('/posts')
      .then(function(_res) {
        res = _res;
        res.should.have.status(200);
        // res.should.be.json;
        res.body.should.have.length.of.at.least(1);
        return Post.count();
        // console.log(res.body);
      })
      .then(function(count) {
        res.body.should.have.length.of(count);
      })
    });
  });

  describe('POST endpoint', function() {
    it('should add a post', function() {

       const newPost = generateTestData();
       // const expectedKeys = ['id', 'publishedAt'].concat(Object.keys(newPost));

      return chai.request(app)
        .post('/posts')
        .send(newPost)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          // expect(res).to.have.all.keys(expectedKeys);
          // expect(res.body.mood).to.equal(newPost.mood);
          // expect(res.body.activity).to.equal(newPost.activity);
          // expect(res.body.note).to.equal(newPost.note);
      });
    });
  });

  //
  // it('should update a post on PUT', function() {
  //   return chai.request(app)
  //   .get('/posts')
  //   .then(function(res) {
  //     const updatedPost = Object.assign(res.body[0], {
  //       mood: 'sad',
  //       activity: ['watch tv', 'eat chips'],
  //       note: 'Could have been better!'
  //     });
  //     return chai.request(app)
  //     .put('/posts/${res.body[0].id}')
  //     .send(updatedPost)
  //     .then(function(res) {
  //       expect(res).to.have.status(204);
  //     });
  //   });
  // });
  //
  // it('should delete a post on DELETE', function() {
  //   return chai.request(app)
  //   .get('/posts')
  //   .then(function(res) {
  //     return chai.request(app)
  //     .delete('/posts/${res.body[0].id}')
  //     .then(function(res) {
  //       expect(res).to.have.status(204);
  //     })
  //   })
  // })

})

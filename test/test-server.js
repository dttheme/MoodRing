'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app , runServer, closeServer } = require('../server.js');
const { TEST_DATABASE_URL } = require('../config')

chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

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

describe('Posts', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list items on GET', function() {
    return chai.request(app)
    .get('/posts')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.not.be.empty;
      // console.log(res.body);
    });
  });

  // it('should add a post on POST', function() {
  //   const newPost = {
  //     mood: 'happy',
  //     activity: ['drink tea', 'make bed', 'pet cat'],
  //     note: 'A good day!',
  //   };
  //    const expectedKeys = ['id', 'publishedAt'].concat(Object.keys(newPost));
  //
  //   return chai.request(app)
  //     .post('/posts')
  //     .send(newPost)
  //     .then(function(res) {
  //       expect(res).to.have.status(201);
  //       expect(res).to.be.json;
  //       expect(res).to.have.all.keys(expectedKeys);
  //       expect(res.body.mood).to.equal(newPost.mood);
  //       expect(res.body.activity).to.equal(newPost.activity);
  //       expect(res.body.note).to.equal(newPost.note);
  //   });
  // });
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

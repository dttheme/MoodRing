'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();
const expect = chai.expect;
const mongoose = require('mongoose');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const { Post } = require('../posts/models')
const { User } = require('../users/models')
const { app , runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config.js');
const { sendAllDataToDb, createTestUser, createTestUserAndPost, generateUserData, generatePostData, tearDownDb } = require('./test-functions')



chai.use(chaiHttp);

describe('Static pages', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  describe('/', function() {
    it('should return 200 status and HTML', function() {
       return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      });
    });
  });

  describe('/login', function() {
    it('should return 200 status and HTML', function() {
      return chai.request(app)
      .get('/login.html')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
    });
  });

})

let testUser;

describe('/posts API Resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(done) {
    createTestUser()
      .then(user => {
        testUser = user;
        return sendAllDataToDb()
      })
      .then(() => done())
      .catch(err => console.log(err))
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET request to /posts', function() {
    it('should list all existing posts', function() {
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      let res;
      return chai.request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${token}`)
      .then(function(_res) {
        res = _res;
        res.should.have.status(200);
        res.should.be.json;
        // res.body.should.be.an('object');
      })
    });
  });

  describe('POST request to /posts', function() {
    it('should add a post', function() {
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      const newPost = generatePostData();
      return chai.request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(newPost)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body.mood).to.deep.equal(newPost.mood);
          expect(res.body.activity).to.deep.equal(newPost.activity);
          expect(res.body.note).to.deep.equal(newPost.note);
      });
    });
  });

  describe('PUT request to /posts', function() {
    it('should update fields sent', function() {
      const updateData = {
        rating: Math.floor(Math.random() * 5) + 1,
        mood: faker.lorem.word(),
        activity: faker.lorem.words(),
        note: faker.lorem.sentence()
      };
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      return Post
        .findOne()
        .then(result => {
          updateData._id = result._id;
          return chai.request(app)
          .put(`/posts/${result._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData)
        })
        .then(res => {
          res.should.have.status(204);
          // res.should.be.an("object");
          return Post.findById(updateData._id);
        })
        .then(post => {
          post.rating.should.deep.equal(updateData.rating);
          post.mood.should.deep.equal([updateData.mood]);
          post.activity.should.deep.equal([updateData.activity]);
          post.note.should.deep.equal(updateData.note);
        });
      });
    });

  describe('DELETE endpoint', function() {
    it('should delete a post by id', function() {
      let deletedPost;
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      return Post
        .findOne()
        .then(_post => {
          deletedPost = _post._id;
          return chai.request(app)
            .delete(`/posts/${deletedPost}`)
            .set('Authorization', `Bearer ${token}`)
        })
        .then(res => {
          res.should.have.status(204);
          return Post.findById(deletedPost);
        })
        .then(post => {
          should.not.exist(post);
        });
      });
    });
});

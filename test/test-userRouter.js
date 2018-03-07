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

describe('/users API Resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(done) {
    testUserData = generateUserData();
    User.create(testUserData)
      .then(user => {
        testUser = user;
        sendAllDataToDb()
        .then(() => done());
      })
      .catch(err => console.log(err))
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('POST request to /users', function() {
    it('should create a new user in the database', function() {
      let newUser = {
        firstName: faker.name.firstName(),
        username: faker.internet.email(),
        password: faker.internet.password()
      };
      return chai.request(app)
        .post('/users')
        .send(newUser)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
        });
      });
    });

  describe('GET request to /login', function() {
    it('should login a user', function() {
      let loginUser = {
        username: testUserData.username,
        password: testUserData.password
      }
      return chai.request(app)
        .post('/auth/login')
        .send(loginUser)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
        });
      });
    });

});

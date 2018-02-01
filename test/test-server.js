'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app , runServer, closeServer } = require('../server.js');
const { TEST_DATABASE_URL } = require('../config')

chai.should();
chai.expect();

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
      res.should.have.status(200);
      res.should.be.html;
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

  it('should list items on GET'), function() {
    return chai.request(app)
    .get('/posts')
    .then(function(res))
  }

  it('should add a post on POST')

  it('should delete a post on DELETE')

  it('should update a post on PUT')

})

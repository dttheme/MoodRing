'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
// const { app , runServer, closeServer } = require('../server.js');

chai.should();
expect = chai.expect();

chai.use(chaiHttp);

describe('/', function() {
  // before(function() {
  //   return runServer();
  // });
  //
  // after(function() {
  //   return closeServer();;
  // });

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
  it('should return 200 status and HTML', function() {
    return chai.request(app)
    .get('/dashboard')
    .hten(function(res) {
      res.should.have.status(200);
      res.should.be.html;
    })
  })
})

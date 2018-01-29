'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
// const { app , runServer, closeServer } = require('../server.js');

chai.should();

chai.use(chaiHttp);

describe('/', function() {
  // before(function() {
  //   return runServer();
  // });
  //
  // after(function() {
  //   return closeServer();;
  // });

  it('should return 200 status when root url is hit', function() {
     return chai.request(app)
    .get('/')
    .then(function(res) {
      res.should.have.status(200);
    });
  });
});

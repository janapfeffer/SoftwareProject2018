// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
// additionally, we tested with console.og during the development process
// How to use this file:
// 1. open command prompt and navigate into the Tests folder
// 2. execute this file with the command "mocha backend_test.js"
// 3. see the results directly in the command prompt
// NOTE: don't run app.js at the same time, as the port will be occupied

var mongoose = require("mongoose");
var Event = require("../Backend/RestAPI/models/event_model");

var assert = require('assert');
var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../Backend/app.js");
var should = chai.should();

chai.use(chaiHttp);

describe('Events', () => {
  /*
  * Test the /GET routes
  */
  describe('/GET events', () => {
      it('it should GET all events', (done) => {
        chai.request(server)
            .get('/events')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
              done();
            });
      });
  });

  // get filtered events uses headers
  describe('/GET events/filtered', () => {
      it('it should GET all events from 2019', (done) => {
        chai.request(server)
            .get('/events/filtered')
            .set("filter_start_date", "2019-01-01 00:00:00.000+00:00")
            .set("filter_end_date", "2019-12-31 00:00:00.000+00:00")
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
              done();
            });
      });
  });

  /*
  * Test the /POST route
  */
  describe('/POST events: all required fields given', () => {
      it('it should POST an event with all required fields', (done) => {
          var event = {
              event_name: "Automated Test Event",
              description: "This event was created using an automated test.",
              address: "Deutschland Mannheim",
              lat: "49.48651",
              lng: "8.46679",
              start_date: "2019-01-01 00:00:00.000+00:00",
              end_date: "2019-01-01 23:00:00.000+00:00",
              event_types: ["5bd1874824c1783894595b68"]
          }
        chai.request(server)
            .post('/events')
            .send(event)
            .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.should.have.property('created_event');
              done();
            });
      });

  });

  describe('/POST events: no event_name given', () => {
      it('it should not POST an event without event_name', (done) => {
          var event = {
              description: "This event was created using an automated test.",
              address: "Deutschland Mannheim",
              lat: "49.48651",
              lng: "8.46679",
              start_date: "2019-01-01 00:00:00.000+00:00",
              end_date: "2019-01-01 23:00:00.000+00:00",
              event_types: ["5bd1874824c1783894595b68"]
          };
        chai.request(server)
            .post('/events')
            .send(event)
            .end((err, res) => {
                  res.should.have.status(500);
                  res.body.should.be.a('object');
                  res.body.should.have.property('error');
              done();
            });
      });

  });
});

describe('Users', () => {
  // function used to create a unique user_email for further testing
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };
  // unique user_email for further testing, as some functions require an existing user
  var user_email = "auto_test" + guid() + "@test.de";
  describe("/signup", () =>  {
    it("it should POST the user(*)", (done) => {
      // * email is generated randomly using a guid
      //   that could potentially cause a fail but the collision probability is extremely small
      var user = {
        email: user_email,
        name: "auto test",
        password: "pw"

      };
      chai.request(server)
          .post("/user/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a("object");
            res.body.should.have.property("user");
            done();
          });
    });
  });

  describe("/signup", () =>  {
    it("it should not POST the user, duplicate email", (done) => {
      var user = {
        email: user_email,
        name: "auto test",
        password: "pw"

      };
      chai.request(server)
          .post("/user/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(409);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("Mail exists");
            done();
          });
    });
  });

  describe("/login", () =>  {
    it("it should login the user", (done) => {
      var user = {
        email: user_email,
        password: "pw"

      };
      chai.request(server)
          .post("/user/login")
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("Auth successful");
            done();
          });
    });
  });
  describe("/login", () =>  {
    it("it should not login the user", (done) => {
      var user = {
        email: user_email,
        password: "not_correct"

      };
      chai.request(server)
          .post("/user/login")
          .send(user)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("Auth failed");
            done();
          });
    });
  });
});

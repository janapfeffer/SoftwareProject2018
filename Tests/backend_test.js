// additionally, we tested with console.log during the development process
// How to run this file:
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


//#####prepare test data#####
var test_data = {};
/*
{ event_types,
  user: {
    token
    email
    name
    password
    _id
  },
  event: {
    _id
  }
}
*/

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

test_data.user = {
  email: user_email,
  name: "auto test",
  password: "pw"

}

test_data.event = {
  event_name: "Automated Test Event",
  description: "This event was created using an automated test.",
  address: "Deutschland Mannheim",
  lat: "49.48651",
  lng: "8.46679",
  start_date: new Date(),
  end_date: new Date(),
  event_types: "5bd1874824c1783894595b68"
}

test_data.comment = "Test Kommentar";
test_data.rating = 1;


//#####run tests#####

//test event_types route
describe("EventTypes", () => {
  describe("/get", () => {
    it("it should get all event types", (done) => {
      chai.request(server)
        .get("/event_types")
        .end((err, res) => {
          //test whether response is correct
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("event_types");
          res.body.event_types.length.should.be.eql(8);
          //save event_types for further processing
          test_data.event_types = res.body.event_types;
          done();
        });
    })
  })
});

//test user routes
describe('Users', () => {
  describe("/signup", () => {
    it("it should POST the user(*)", (done) => {
      // * email is generated randomly using a guid
      //   that could potentially cause a fail but the collision probability is extremely small
      chai.request(server)
        .post("/user/signup")
        .send(test_data.user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("user");
          done();
        });
    });
  });

  describe("/signup", () => {
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

  describe("/login", () => {
    it("it should login the user", (done) => {
      chai.request(server)
        .post("/user/login")
        .send(test_data.user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Auth successful");
          res.body.should.have.property("user");
          test_data.user.token = res.body.user.token;
          test_data.user._id = res.body.user._id;
          done();
        });
    });

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

describe('Events', () => {
  // Test the /GET routes
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

  // Test the /POST route
  describe('/POST events', () => {
    it('it should POST an event with all required fields & auth', (done) => {
      chai.request(server)
        .post('/events')
        .set("authorization", "Bearer " + test_data.user.token)
        .send(test_data.event)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('created_event');
          test_data.event._id = res.body.created_event._id;
          done();
        });
    });

    it('it should not POST, Auth fails (no auth given)', (done) => {
      chai.request(server)
        .post('/events')
        .send(test_data.event)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql("Auth failed");;
          done();
        });
    });

    it('it should not POST an event without event_name, auth given', (done) => {
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
        .set("authorization", "Bearer " + test_data.user.token)
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

describe('User-Events Interaction', () => {
  describe("/user/saveEvent", () => {
    it("it should save the event as favorite", (done) => {
      chai.request(server)
        .post("/user/saveEvent")
        .set("authorization", "Bearer " + test_data.user.token)
        .send(test_data.user._id, test_data.event._id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eql("Event saved");
          done();
        });
    });
  });

  describe("/user/:userId/events", () => {
    it("it should return the saved event", (done) => {
      ;
      chai.request(server)
        .get("/user/" + test_data.user._id + "/events")
        .set("authorization", "Bearer " + test_data.user.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("saved_events");
          res.body.should.have.property("count").eql(1);
          done();
        });
    })
  });

  describe("/user/:userId/saved_events_ids", () => {
    it("it should return the saved event", (done) => {
      ;
      chai.request(server)
        .get("/user/" + test_data.user._id + "/saved_events_ids")
        .set("authorization", "Bearer " + test_data.user.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("saved_events");
          done();
        });
    })
  });

  describe("/user/unsaveEvent", () => {
    it("it should unsave the saved event", (done) => {
      ;
      chai.request(server)
        .post("/user/unsaveEvent")
        .set("authorization", "Bearer " + test_data.user.token)
        .send(test_data.user._id, test_data.event._id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eql("Event unsaved");
          done();
        });
    })
  });

  describe("/events/addComment", () => {
    it("it should add a comment to the created event", (done) => {
      ;
      chai.request(server)
        .post("/events/addComment")
        .set("authorization", "Bearer " + test_data.user.token)
        .send(test_data.user._id, test_data.user.name, test_data.event._id, test_data.comment)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eql("Comment saved");
          done();
        });
    })
  });

  describe("/events/rate", () => {
    it("it should rate the previously created event", (done) => {
      chai.request(server)
        .post("/events/rate")
        .set("authorization", "Bearer " + test_data.user.token)
        .send({
          "eventId": test_data.event._id,
          "rating": test_data.rating
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eql("Rating saved");
          done();
        });
    })
  });
});

describe("delete testdata", () => {
  describe("/user/:userId", () => {
    it("it should delete the test user", (done) => {
      chai.request(server)
        .delete("/user/" + test_data.user._id)
        .set("authorization", "Bearer " + test_data.user.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eql("User deleted");
          done();
        });
    })
  });

  describe("/event/:eventId", () => {
    it("it should delete the test event", (done) => {
      chai.request(server)
        .delete("/events/" + test_data.event._id)
        .set("authorization", "Bearer " + test_data.user.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eql("Event deleted");
          done();
        });
    })
  });
});

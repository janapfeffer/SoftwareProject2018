const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const OEvent = require("../models/event_model");

exports.user_signup = (req, res, next) => {
  //check whether an account with that email already exists
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        // save password as hash
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            // new user
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              name: req.body.name,
              password: hash
            });
            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: "User created",
                  user: {
                    email: req.body.email,
                    name: req.body.name,
                    password: hash
                  }
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.add_to_saved_events = (req, res, next) => {
    const event_id = req.body.eventId;
    const user_id = req.body.userId;
    User.findById(user_id, "saved_events", function (err, user) {
      try{
      if (user.saved_events.indexOf(event_id) > -1){
        throw new Error("Event already saved.");
      } else {
        User.updateOne(
          { _id: user_id},
          { $push: { saved_events: event_id }},
          { upsert: true}
        )
        .exec()
        .then(result => {
          res.status(200).json({
            message: "Event saved",
            request: {
              type: "GET",
              url: "http://localhost:3000/user/" + user_id + "/events"
            }
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
      }
    }
    catch(err) {
      console.log(err);
      res.status(500).json({
        error: err
      });
    }
  } )
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .select("email password saved_events name")
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          // console.log(user[0]);
          // const token = jwt.sign(
          //   {
          //     email: user[0].email,
          //     userId: user[0]._id
          //   },
          //   process.env.JWT_KEY,
          //   {
          //     expiresIn: "1h"
          //   }
          // );
          return res.status(200).json({
            message: "Auth successful",
            // token: token,s
            // saved_events: user[0].saved_events
            user: {
              saved_events: user[0].saved_events,
              _id: user[0]._id,
              email: user[0].email,
              name: user[0].name
            }
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.get_saved_events = (req, res, next) => {
  //"http://localhost:3000/user/" + user_id + "/events"
  User.findById(req.params.userId, "saved_events", function(err, event) {
  })
  .exec()
  .then(user => {
      OEvent.find({
        _id: {
          $in: user.saved_events
        }
      })
      .select("_id event_name author description address start_date end_date event_picture event_link ticket_link comments lat lng current_rating")
      .populate("event_type")
      .exec()
      .then(events => {
        console.log(events);
        res.status(200).json({
          count: user.saved_events.length,
          saved_events: events.map(event => {
              return {
                  _id: event._id,
                  event_name: event.event_name,
                  author: event.author,
                  description: event.description,
                  address: event.address,
                  start_date: event.start_date,
                  end_date: event.end_date,
                  event_picture: event.event_picture,
                  event_link: event.event_link,
                  ticket_link: event.ticket_link,
                  comments: event.comments,
                  event_types: event.event_types,
                  lat: event.lat,
                  lng: event.lng,
                  current_rating: event.current_rating
              };
          })

          // .then(events => {
          //   return {
          //     "hi"
          //   }
          // })

          // saved_events: user.saved_events.map(event => {
          //   return {
          //     _id: event._id
          //
          //   }
        });
      })

    })
    .catch(err => {
        console.error("Error: ", err.stack);
        res.status(500).json({
            error: err
        })
    });

};

//todo find saved event first before trying to delete?
exports.delete_saved_event = (req, res, next) => {
  const event_id = req.body.eventId;
  const user_id = req.body.userId;
  User.findById(user_id, "saved_events", function (err, user) {
      User.updateOne(
        { _id: user_id},
        { $pull: { saved_events: event_id }},
        { upsert: true}
      )
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Event unsaved",
          request: {
            type: "GET",
            url: "http://localhost:3000/user/" + user_id + "/events"
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    });
};

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

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
                  email: req.body.email,
                  name: req.body.name,
                  password: hash
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
        } else { // not needed with JWT, then it's done later!
          return res.status(200).json({
            message: "Auth successful"
          });
        }

        // if (result) {
        //   const token = jwt.sign(
        //     {
        //       email: user[0].email,
        //       userId: user[0]._id
        //     },
        //     process.env.JWT_KEY,
        //     {
        //       expiresIn: "1h"
        //     }
        //   );
        //   return res.status(200).json({
        //     message: "Auth successful",
        //     token: token
        //   });
        // }
        // res.status(401).json({
        //   message: "Auth failed"
        // });
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
};

exports.delete_saved_event = (req, res, next) => {
  //use $pull
};

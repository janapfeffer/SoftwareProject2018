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

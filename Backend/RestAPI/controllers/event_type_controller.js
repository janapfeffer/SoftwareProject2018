const mongoose = require("mongoose");
const Event_Type = require ("./models/event_type_model");

exports.get_event_types = (req, res, next) => {
    Event_Type.find()
        .select("event_type _id")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                event_types: docs.map(doc => {
                    return {
                        event_type: doc.event_type,
                        _id: doc._id,
                        request: {
                            type: "GET",
                             url: "http://localhost:3000/event_type/" + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.error("Error: ", err.stack);
            res.status(500).json({
                error:err
            });
        });
};

exports.get_event_type = (req, res, next) => {
  const id = req.params._id;
  Event.findById(id)
    .select("event_type")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          event_type: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/event_type/" + id
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

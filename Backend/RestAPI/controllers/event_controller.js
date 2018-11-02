const mongoose = require("mongoose");
const OEvent = require("../models/event_model");
const EventType = require("../models/event_type_model");


//todo: add additional needed fields
exports.get_all_events = (req, res, next) => {
    OEvent.find() //enter: {verification_status: true} into brackets for only verified events
        .select("_id event_name author description address start_date end_date event_picture event_link ticket_link comments loc")
        .populate("event_types")
        .exec()
        .then(elements => {
            res.status(200).json({
                count: elements.length,
                oEvents: elements.map(element => {
                    return {
                        _id: element._id,
                        event_name: element.event_name,
                        author: element.author,
                        description: element.description,
                        address: element.address,
                        start_date: element.start_date,
                        end_date: element.end_date,
                        event_picture: element.event_picture,
                        event_link: element.event_link,
                        ticket_link: element.ticket_link,
                        comments: element.comments,
                        event_types: element.event_types,
                        request: {
                            type: "GET",
                            uri: "http://localhost:3000/events/" + element._id
                        }
                    };
                })
            });
        })
        .catch(err => {
            console.error("Error: ", err.stack);
            res.status(500).json({
                error: err
            })
        });
}


exports.create_event = (req, res, next) => {
    console.log("IN Methode");

  var pic_filepath = "";
    EventType.find({
        _id: {
            $in: req.body.eventTypeIds
        }
    })
    .exec()
    .then(eventType => {
        if (!eventType) {
            return res.status(404).json({
                message: "Wrong event type given"
            }).then (function() {
              if (typeof req.file.path === "undefined") {
                pic_filepath = req.file.path;
              }
            });
        }
    });


    console.log(req.body);

    const oEvent = new OEvent({
        _id: new mongoose.Types.ObjectId(),
        author: req.body.userId,
        event_name: req.body.event_name,
        description: req.body.description,
        address: {
            freeformAddress: req.body.address.freeformAddress,
            loc: {
              lat: req.body.address.loc.lat,
              lng: req.body.address.loc.lng
            }
        },
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        event_link: req.body.event_link,
        ticket_link: req.body.ticket_link,
        event_types: req.body.eventTypeIds,
        event_picture: pic_filepath
    });

    oEvent
        .save()
        .then(result => {
            res.status(201).json({
                message: "Created new event successfully",
                created_event: {
                    _id : result._id,
                    event_name: result.event_name,
                    description: result.description,
                    author: result.author,
                    address: {
                        freeformAddress: result.address.freeformAddress,
                        loc: result.address.loc
                    },
                    start_date: result.start_date,
                    end_date: result.end_date,
                    event_picture: result.event_picture,
                    event_link: result.event_link,
                    ticket_link: result.ticket_link,
                    event_types: result.event_types,
                    request: {
                        type: "GET",
                        uri: "http://localhost:3000/events/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.error("Error: ", err.stack);
            res.status(500).json({
                error: err
            })
        });
};

exports.delete_comment = (req, res, next) => {
  console.log(req.body.eventId);
  OEvent.findById(req.body.eventId, "comments", function(err, event) {
    OEvent.updateOne(
      { _id: req.body.eventId },
      { $pull: { comments: {_id: req.body.commentId}} },
      { upsert: true})
      .exec()
    .then(result => {
      res.status(200).json({
        message: "Comment deleted",
        request: {
          type: "GET",
          url: "http://localhost:3000/events"
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

exports.add_comment = (req, res, next) => {
  OEvent.findById(req.body.eventId, "comments", function(err, event) {
    OEvent.updateOne(
      { _id: req.body.eventId },
      { $push: { comments: {
          username: req.body.userId,
          comment: req.body.comment }
        }
      },
      { upsert: true})
      .exec()
    .then(result => {
      res.status(200).json({
        message: "Comment saved",
        request: {
          type: "GET",
          url: "http://localhost:3000/events"
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

exports.get_event = (req, res, next) => {
  const id = req.params.eventId;
  OEvent.findById(id)
  .select("_id event_name author description address start_date end_date event_picture event_link ticket_link comments")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/events"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//the parameters in the body have to have the same name as in the database (e.g. event_name)
//todo: check, whether this works eg for the address
exports.update_event = (req, res, next) => {
  const id = req.params.eventId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  OEvent.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Event updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/events/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


//todo: only delete owned events -> if no event is found, it doesn't belong to user/doesn't exist
exports.delete_event = (req, res, next) => {
  OEvent.remove({ _id: req.params.eventId, author: req.body.user_id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Event deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.rate_event = (req, res, next) => {
  //add rating and number_of_ratings to event model. update rating to avg
  //add rated_events to user and save which events he has voted for -> only 1 voting possible
};

exports.get_filtered_events = (req, res, next) => {
  //get events with filters applied
};

exports.report_event = (req, res, next) => {
  //report an event
};

// exports.report_comment = (req, res, next) => {
//   //report a comment,
// };

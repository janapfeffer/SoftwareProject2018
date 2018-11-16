const mongoose = require("mongoose");
const OEvent = require("../models/event_model");
const EventType = require("../models/event_type_model");


exports.get_all_events = (req, res, next) => {
  OEvent.find() //enter: {verification_status: true} into brackets for only verified events
    .select("_id event_name author description address start_date end_date event_picture event_link ticket_link comments lat lng current_rating ratings")
    .populate("event_types")
    .populate("comments")
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
            lng: element.lng,
            lat: element.lat,
            start_date: element.start_date,
            end_date: element.end_date,
            event_picture: element.event_picture,
            event_link: element.event_link,
            ticket_link: element.ticket_link,
            comments: element.comments,
            event_types: element.event_types,
            current_rating: element.current_rating,
            ratings: element.ratings,
            request: {
              type: "GET",
              uri: "http://localhost:3000/events/" + element._id
            }
          };
        })
      });
    })
    .catch(err => {
      // console.error("Error: ", err.stack);
      res.status(500).json({
        error: err
      })
    });
};

// requires body with: eventId, userId, rating. rating must be the opposite of the rating that is delete_saved_event
// -> if the event was rated with a thumb up (1) enter -1
exports.event_rating = (req, res, next) => {
  OEvent.findById(req.body.eventId, "ratings", function (err, event) {
    old_rating = event.ratings.find(obj => {
      return obj.user_id == req.body.userId;
    });
    // console.log(old_rating._id);
    if(old_rating) {
      OEvent.updateOne(
        { _id: req.body.eventId},
        { $set: {
            ratings: {
              _id: old_rating._id,
              user_id: req.body.userId,
              rating: (req.body.rating)
            }
          },
          $inc: {
            current_rating: req.body.rating * 2
          }
        },
        { upsert: true}
      )
        .exec()
        .then(result => {
          res.status(200).json({
            message: "Rating Changed",
            request: {
              type: "GET",
              url: "http://localhost:3000/events"
            }
          });
        })
        .catch(err => {
          // console.log(err);
          res.status(500).json({
            error: err
          });
        });
    } else {
      OEvent.updateOne(
        { _id: req.body.eventId},
        { $push: {
            ratings: {
              user_id: req.body.userId,
              rating: req.body.rating
            }
          },
          $inc: {
            current_rating: req.body.rating
          }
        },
        { upsert: true}
      )
        .exec()
        .then(result => {
          res.status(200).json({
            message: "Rating saved",
            request: {
              type: "GET",
              url: "http://localhost:3000/events"
            }
          });
        })
        .catch(err => {
          // console.log(err);
          res.status(500).json({
            error: err
          });
        });
    }
  });
};


exports.create_event = (req, res, next) => {
  // console.log(req.body);
  if(req.file) {
    var path = req.file.path;
  } else {
    var path = "event_images\\standard.png";
  }
  const oEvent = new OEvent({
    _id: new mongoose.Types.ObjectId(),
    author: req.body.userId,
    event_name: req.body.event_name,
    description: req.body.description,
    address: req.body.address,
    lat: req.body.lat,
    lng: req.body.lng,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    event_link: req.body.event_link,
    ticket_link: req.body.ticket_link,
    event_types: req.body.event_types,
    event_picture: path //req.file.path
  });

  oEvent
    .save()
    .then(result => {
      res.status(201).json({
        message: "Created new event successfully",
        created_event: {
          _id: result._id,
          event_name: result.event_name,
          description: result.description,
          author: result.author,
          address: result.address,
          lat: result.lat,
          lng: result.lng,
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
      // console.error("Error: ", err.stack);
      res.status(500).json({
        error: err
      })
    });
};

//todo: find comment first before deleting?
exports.delete_comment = (req, res, next) => {
  // console.log(req.body.eventId);
  OEvent.findById(req.body.eventId, "comments", function (err, event) {
    OEvent.updateOne(
      { _id: req.body.eventId },
      { $pull: { comments: { _id: req.body.commentId } } },
      { upsert: true })
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
        // console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
};

exports.add_comment = (req, res, next) => {
  OEvent.findById(req.body.eventId, "comments", function (err, event) {
    // console.log(event);
    OEvent.updateOne(
      { _id: req.body.eventId },
      {
        $push: {
          comments: {
            username: req.body.username,
            user_id: req.body.userId,
            comment: req.body.comment
          }
        }
      },
      { upsert: true })
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
        // console.log(err);
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
      // console.log("From database", doc);
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
      // console.log(err);
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
      // console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


//todo: only delete owned events -> if no event is found, it doesn't belong to user/doesn't exist
//should not be an issue though if the frontend calls it correctly
//delete picture if given (NOT if its the default picture)
exports.delete_event = (req, res, next) => {
  OEvent.remove({ _id: req.params.eventId, author: req.body.user_id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Event deleted"
      });
    })
    .catch(err => {
      // console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//events filtered for time range (start_date and end_date)
// either/both start_date and end_date within the time range or start_date before and end_date after
// needs: filter_start_date and filter_end_date
exports.get_filtered_events = (req, res, next) => {
  //https://stackoverflow.com/questions/32353999/mongoose-select-query-between-two-time-range
  //get events with time range filters applied
  // check wich filters are given and only apply the given ones:
  //    start date: all events after/on this start date: for initial loading
  //    start & end date: all events where at least one day is in the time range
  // console.log(req.headers);
  if (req.headers.filter_end_date) {
    OEvent.find({
      $or: [
        {
          start_date: { //start_date within
          $gte: req.headers.filter_start_date,
          $lte: req.headers.filter_end_date
          }
        },
        {
          end_date: { // end_date within
            $gte: req.headers.filter_start_date,
            $lte: req.headers.filter_end_date
          }
        },
        {
          end_date: {
            $gte: req.headers.filter_end_date
          },
          start_date: {
            $lte: req.headers.filter_start_date
          }
        } // end_date and start_date around
      ]
    }) //enter: {verification_status: true} into brackets for only verified events
      .select("_id event_name author description address start_date end_date event_picture event_link ticket_link comments lat lng current_rating ratings")
      .populate("event_types")
      .populate("comments")
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
              lng: element.lng,
              lat: element.lat,
              start_date: element.start_date,
              end_date: element.end_date,
              event_picture: element.event_picture,
              event_link: element.event_link,
              ticket_link: element.ticket_link,
              comments: element.comments,
              event_types: element.event_types,
              ratings: element.ratings,
              current_rating: element.current_rating,
              request: {
                type: "GET",
                uri: "http://localhost:3000/events/" + element._id
              }
            };
          })
        });
      })
      .catch(err => {
        // console.error("Error: ", err.stack);
        res.status(500).json({
          error: err
        })
      });
  } else { // no end_date -> INITIAL LOADING
    // console.log("initial loading");
    OEvent.find({


          start_date: { //start_date within
          $gte: req.headers.filter_start_date
          }


    }) //enter: {verification_status: true} into brackets for only verified events
      .select("_id event_name author description address start_date end_date event_picture event_link ticket_link comments lat lng current_rating ratings")
      .populate("event_types")
      .populate("comments")
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
              lng: element.lng,
              lat: element.lat,
              start_date: element.start_date,
              end_date: element.end_date,
              event_picture: element.event_picture,
              event_link: element.event_link,
              ticket_link: element.ticket_link,
              comments: element.comments,
              event_types: element.event_types,
              ratings: element.ratings,
              current_rating: element.current_rating,
              request: {
                type: "GET",
                uri: "http://localhost:3000/events/" + element._id
              }
            };
          })
        });
      })
      .catch(err => {
        // console.error("Error: ", err.stack);
        res.status(500).json({
          error: err
        })
      });
  }

};

// exports.report_event = (req, res, next) => {
//   //report an event
// };

// exports.report_comment = (req, res, next) => {
//   //report a comment,
// };

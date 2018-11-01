const mongoose = require("mongoose");
const OEvent = require("../models/event_model");
const EventType = require("../models/event_type_model");


//todo: add additional needed fields
exports.get_all_events = (req, res, next) => {
  //todo only get verified events
    OEvent.find()
        .select("_id event_name author description address start_date end_date event_picture event_link ticket_link comments loc")
        .populate("event_types")
        .exec()
        .then(elements => {
            res.status(200).json({
                count: elements.length,
                oEvents: elements.map(element => {
                    return {
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

//Image muss noch hinzugefügt werden
exports.create_event = (req, res, next) => {
  var pic_filepath = "./SoftwareProject2018/Backend/event_images/standard.png";
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
                    event_name: result._id,
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

exports.add_comment = (req, res, next) => {
  //add a comment to one event
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

exports.report_event = (req, res, next) => {
  //report an event
};

// exports.report_comment = (req, res, next) => {
//   //report a comment,
// };

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

exports.rate_event = (req, res, next) => {
  //add rating and number_of_ratings to event model. update rating to avg
  //add rated_events to user and save which events he has voted for -> only 1 voting possible
};

exports.get_filtered_events = (req, res, next) => {
  //get events with filters applied
};

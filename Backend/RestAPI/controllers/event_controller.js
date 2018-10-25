const mongoose = require ("mongoose");
const Event = require("./models/event_model.js");

exports.create_event = (req, res, next) => {
    const event = new Event({
        _id: new mongoose.Types.ObjectId(),
        event_name: req.body.event_name,
        author: req.body.author,
        description: req.body.description,
        address: req.body.address,
        instagram_hashtag: reg.body.instagram_hashtag,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        event_link: req.body.event_link,
        ticket_link: req.body.ticket_link,
        event_type: req.body.event_type
    })
};

exports.get_events = (req, res, next) => {
  Event.find()
      .select("event_name _id")
      .exec()
      .then(docs => {
          const response = {
              count: docs.length,
              events: docs.map(doc => {
                  return {
                      event_name: doc.event_name,
                      _id: doc._id,
                      request: {
                          type: "GET",
                           url: "http://localhost:3000/events/" + doc._id
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

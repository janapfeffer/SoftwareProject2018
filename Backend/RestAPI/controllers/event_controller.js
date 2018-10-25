const mongoose = require ("mongoose");
const Event = require("./models/event_model.js");

exports.get_events();

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
}

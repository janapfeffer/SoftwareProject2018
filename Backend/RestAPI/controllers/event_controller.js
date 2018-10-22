const mongoose = require ("mongoose");
const Event = require("./models/event_model.js");

exports.get_events();

exports.create_event = (req, res, next) => {
    const event = new Event({
        _id: new mongoose.Types.ObjectId(),
        event_name: req.body.event_name,
        description: req.body.description,
        address: req.body.address,
        start_date: req.body.start_date,
        
    })
}
const mongoose = require("mongoose");
const Event_Type = require ("./models/event_type_model");

//init event types in database

exports.init_event_types = (req, res, next) => {
    const eventType = new Event_Type({
        _id: new mongoose.Types.ObjectId(),
        event_type: req.body.event_type,
        
    });

    eventType.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created event type successfully",
            newEventType:{
                _id: result._id,
                event_type: result.event_type,
                request: {
                    type: "POST",
                    url: "http://localhost:3000/event_types/"+ result._id
                }
            }
        })
    }). catch(err => {
        console.error("Error: ", err.stack);
        res.status(500).json({
            err: err
        })
    })
}

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
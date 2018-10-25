const mongoose = require("mongoose");
const OEvent = require("../models/event_model");
const EventType = require("../models/event_type_model");

exports.get_all_events = (req, res, next) => {
    OEvent.find()
        .select("_id event_name author description address start_date end_date event_link ticket_link instagram_hashtag comments")
        .populate("event_types")
        .exec()
        .then(elements => {
            res.status(200).json({
                count: elements.length,
                oEvents: elements.map(element => {
                    return {
                        event_name: element._id,
                        author: element.author,
                        description: element.description,
                        address: element.address,
                        start_date: element.start_date,
                        end_date: element.end_date,
                        event_link: element.event_link,
                        ticket_link: element.ticket_link,
                        instagram_hashtag: element.instagram_hashtag,
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
    EventType.find({
        _id: { 
            $in: req.body.eventTypeIds 
        }
    }).then(eventType => {
        if (!eventType) {
            return res.status(404).json({
                message: "Wrong event type given"
            });
        } 
        const oEvent = new OEvent({
            _id: new mongoose.Types.ObjectId(),
            event_name: req.body.event_name,
            description: req.body.description,
            address: {
                city: req.body.address.city,
                zip: req.body.address.zip,
                street: req.body.address.street,
                house_number: req.body.address.house_number,
            },
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            event_link: req.body.event_link,
            ticket_link: req.body.ticket_link,
            instagram_hashtag: req.body.instagram_hashtag,
            event_types: req.body.eventTypeIds
        });
        oEvent
            .save()
            .then(result => {
                res.status(201).json({
                    message: "Created new event successfully",
                    created_event: {
                        event_name: result._id,
                        description: result.description,
                        address: {
                            city: result.address.city,
                            zip: result.address.zip,
                            street: result.address.street,
                            house_number: result.address.house_number,
                        },
                        start_date: result.start_date,
                        end_date: result.end_date,
                        event_link: result.event_link,
                        ticket_link: result.ticket_link,
                        instagram_hashtag: result.instagram_hashtag,
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
    });


}
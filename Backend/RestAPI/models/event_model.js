const mongoose = require("mongoose");

const oEventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    event_name: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

    address: {
        freeformAddress: { type: String, required: true },
        loc: { lng: {type: Number, required: true} ,lat: {type: Number, required: true}},
    },

    event_picture: { type: String, required: false },
    instagram_hashtag: { type: String, required: false },
    verification_status: { type: Boolean, default: false },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: false },
    event_link: { type: String, required: false },
    ticket_link: { type: String, required: false },
    event_types: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event_Type", required: true }],
    times_reported: { type: Number, default: 0 },

    comments: [{
        username: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
        // should we replace this with the direct username instead of a reference?
        comment: { type: String, required: true }
    }]
});

module.exports = mongoose.model('OEvent', oEventSchema);

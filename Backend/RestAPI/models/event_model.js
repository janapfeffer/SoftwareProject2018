const mongoose = require ("mongoose");

const eventSchema = mongoose.Schema ({
    _id: mongoose.Schema.Types.ObjectId,
       event_name: {
           type: String,
           required: true
       },
       author: {
            type: String,
            required: false
       },
        description: {
        type: String,
        required: true
        },
        address: {
            city: {
                type: String,
                required: true
            },
            zip: {
                type: Number,
                required: true
            },
            street: {
                type: String,
                required: true
            },
            house_number: {
                type: Number,
                required: true
            },
            address_additional:{
                type: String,
                required: false
            }
        },
        instagram_hashtag: {
            type: String,
            required: false
        },
        verification_status: {
            type: Boolean,
            default: false
        },
        start_date: {
            type: Date,
            required: true
        },
        end_date: {
            type: Date,
            required: false
        },
        event_link: {
            type: String,
            required: false
        },
        ticket_link: {
            type: String,
            required: false
        },
        event_type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event_Type",
            required: true
        },
        times_reported: {
            type: Number,
            default: 0
        },
        comments: {
            username: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: false
            },
            comment:{
                type: String,
                required: true
            }
        }
});

module.exports = mongoose.model('Event', eventSchema);

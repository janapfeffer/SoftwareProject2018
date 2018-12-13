const mongoose = require("mongoose");

const oEventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  event_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  address: {
    type: String,
    required: false
  },
  lng: {
    type: Number,
    required: false
  },
  lat: {
    type: Number,
    required: false
  },
  event_picture: {
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
  event_types: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event_Type",
    required: true
  }],
  times_reported: {
    type: Number,
    default: 0
  },

  comments: [{
    username: {
      type: String,
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  }],
  current_rating: {
    type: Number,
    default: 0
  },
  ratings: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    rating: {
      type: Number,
      required: true
    }
  }]
});

module.exports = mongoose.model('OEvent', oEventSchema);

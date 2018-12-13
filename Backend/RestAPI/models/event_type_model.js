const mongoose = require("mongoose");

const eventTypeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  event_type: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Event_Type', eventTypeSchema);

const mongoose = require ("mongoose");

const userSchema = mongoose.Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    facebook_id: {
        type: String,
        require: false
    },
    name: {
        type: String,
        require: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { 
        type: String, 
        required: true 
    },
    saved_events:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Event", 
        required: false 
    }
});

module.exports = mongoose.model('User', userSchema);
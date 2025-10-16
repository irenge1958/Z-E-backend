const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({

    message: {
        type: String,
        required: true
    },
   
    email: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('inquire', notificationSchema);

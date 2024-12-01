const mongoose = require('mongoose');

const Reminder = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateTime:{
        type:String,
        required: true
    },
    recurring:{
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model("Reminder", Reminder);

const mongoose = require('mongoose');


const Expenses = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
module.exports = mongoose.model("Expenses", Expenses);

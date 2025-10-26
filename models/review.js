const { types, date } = require("joi");
const mongoose = require("mongoose");
const { getMaxListeners } = require("./listing");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        date: {
            type: String,
            default: () => new Date().toLocaleDateString()
        },
        time: {
            type: String,
            default: () => new Date().toLocaleTimeString()
        }
    }
});

module.exports = mongoose.model('Review', reviewSchema);
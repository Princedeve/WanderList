const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        require: true,
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
    },
        outher: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model('Review', reviewSchema);
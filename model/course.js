const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        image: { type: String }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Course', courseSchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VoteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventName: {
        type: String,
        required: true,
    },
    tags: String,
    datetime: {
        type: String,
        required: true,
    },
    voted: {
        type: Boolean,
        required: true,
        default: true,
    },
    refused: {
        type: Boolean,
        required: true,
        default: false,
    }
});

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;
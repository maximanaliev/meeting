const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventTimerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    first: {
        type: String,
        required: true,
        validate: {
            validator: async function () {
                if (isNaN(this.first)) {
                    throw new Error("Неверный формат времени");}
            }
        },
    },
    second: {
        type: String,
        required: true,
        validate: {
            validator: async function () {
                if (isNaN(this.second)) {
                    throw new Error("Неверный формат времени");
                }
            }
        },
    },
    started: {
        type: Boolean,
        required: true,
        default: true,
    },
    timerUp: {
        type: Boolean,
        required: true,
        default: false,
    }
});

const EventTimer = mongoose.model('EventTimer', EventTimerSchema);

module.exports = EventTimer;
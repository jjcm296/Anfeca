const mongoose = require('mongoose');
const { Schema } = require('mongoose');

function greaterThanZero(number) {
    return number > 0;
}

const rewardSchema = Schema({
    name: { type: String, required: true },
    redemptionCount: {
        type: Number,
        default:0,
        required: true
    },
    redemptionLimit: {
        type: Number,
        validate: {
            validator: greaterThanZero,
            message:  'redemptionLimit must be greater than 0'
        }
    }
});

module.exports = mongoose.model('Reward', rewardSchema);
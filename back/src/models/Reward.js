const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { isStringLengthGreaterThanZero,
    messageStringLengthGreaterThanZero,
    isGreaterThanZero,
    messageGreaterThanZero,
    isZeroOnInsertOnly,
    messageMustBeZeroOnInsert
    } = require('../lib/db/validatorFunctions.js')


const rewardSchema = Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: isStringLengthGreaterThanZero,
            message: messageStringLengthGreaterThanZero
        }
    },
    redemptionCount: {
        type: Number,
        default:0,
        required: true,
        validate: {
            validator: isZeroOnInsertOnly,
            message: messageMustBeZeroOnInsert
        }
    },
    redemptionLimit: {
        type: Number,
        validate: {
            validator: isGreaterThanZero,
            message: messageGreaterThanZero
        }
    },
    guardianId: { type: Schema.Types.ObjectId, ref: 'Guardian', required: true }
});

module.exports = mongoose.model('Reward', rewardSchema);
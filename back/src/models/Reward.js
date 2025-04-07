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
    type: {
        type: String,
        enum: ['forever', 'once', 'custom'],
        required: true
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

rewardSchema.pre('validate', function (next) {
    // Automatically assign redemptionLimit based on type if not provided
    if (this.type === 'once') {
        this.redemptionLimit = 1;
    }

    if (this.type === 'forever') {
        this.redemptionLimit = undefined; // will be omitted from the document
    }

    if (this.type === 'custom') {
        if (this.redemptionLimit === undefined || this.redemptionLimit <= 0) {
            return next(new Error("If type is 'custom', a valid redemptionLimit (> 0) is required."));
        }
    }

    next();
});

module.exports = mongoose.model('Reward', rewardSchema);
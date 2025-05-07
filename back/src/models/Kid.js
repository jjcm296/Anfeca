const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const {
    isStringLengthGreaterThanZero,
    messageStringLengthGreaterThanZero,
    isZeroOnInsertOnly,
    messageMustBeZeroOnInsert,
    isOneOnInsertOnly,
    messageMustBeOneOnInsert
    } = require('../lib/db/validatorFunctions.js');

const kidSchema = Schema({
    name:{
        type: String,
        required: true,
        validate:{
            validator: isStringLengthGreaterThanZero,
            message: messageStringLengthGreaterThanZero

        }
    },
    coins: {
        type: Number,
        default:0,
        required: true,
        validate: {
            validator: isZeroOnInsertOnly,
            message: messageMustBeZeroOnInsert
        }
    },
    streak: {
        type: Number,
        default: 1,
        required:true,
        validate: {
            validator: isOneOnInsertOnly,
            message: messageMustBeOneOnInsert
        }
    },
    guardianId: { type: Schema.Types.ObjectId, ref: 'Guardian', required: true }
});

module.exports = mongoose.model('Kid', kidSchema);
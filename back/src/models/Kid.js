const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const {
    isStringLengthGreaterThanZero,
    messageStringLengthGreaterThanZero,
    isZeroOnInsertOnly,
    messageMustBeZeroOnInsert
    } = require('../lib/validatorFunctions.js');

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
        default: 0,
        required:true,
        validate: {
            validator: isZeroOnInsertOnly,
            message: messageMustBeZeroOnInsert
        }
    },
    guardianId: { type: Schema.Types.ObjectId, ref: 'Guardian', required: true }
});

module.exports = mongoose.model('Kid', kidSchema);
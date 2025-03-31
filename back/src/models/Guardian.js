const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { isStringLengthGreaterThanZero, messageStringLengthGreaterThanZero } = require('../lib/validatorFunctions.js')

const guardianSchema = Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: isStringLengthGreaterThanZero,
            message: messageStringLengthGreaterThanZero
        }
    },
    lastName: {
        type: String,
        required: true,
        validate: {
            validator: isStringLengthGreaterThanZero,
            message: messageStringLengthGreaterThanZero
        }
    }
});

module.exports = mongoose.model('Guardian', guardianSchema)
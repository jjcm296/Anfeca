const mongoose = require('mongoose');
const { Schema } = mongoose;
const { isStringLengthGreaterThanZero, messageStringLengthGreaterThanZero } = require('../lib/db/validatorFunctions.js')

const bankSchema = Schema({
    name:  {
        type: String,
        required: true,
        validate: {
            validator: isStringLengthGreaterThanZero,
            message: messageStringLengthGreaterThanZero
        }
    },
    guardianId: { type: Schema.Types.ObjectId, ref: 'Guardian', required: true }
});

module.exports = mongoose.model('Bank', bankSchema);
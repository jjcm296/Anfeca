const mongoose = require('mongoose');
const { Schema } = mongoose;
const { isStringLengthGreaterThanZero, messageStringLengthGreaterThanZero } = require('../lib/validatorFunctions.js')

const questionsBankSchema = Schema({
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

module.exports = mongoose.model('QuestionsBank', questionsBankSchema);
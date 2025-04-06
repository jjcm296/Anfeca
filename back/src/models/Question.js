const mongoose = require('mongoose');
const { Schema } = mongoose;
const {
    isStringLengthGreaterThanZero,
    messageStringLengthGreaterThanZero,
    validateNumberOfAnswers,
    messageNumberOfAnswers
    } = require('../lib/db/validatorFunctions.js');

const questionSchema = Schema({
    textQuestion: {
        type: String,
        required: true,
        validate: {
            validator: isStringLengthGreaterThanZero,
            message: messageStringLengthGreaterThanZero
        }
    },
    answers: {
        type: [
            {
                textAnswer:{ type: String, required: true },
                isCorrect: { type: Boolean, required: true }
            }
        ],
        validate: {
            validator: validateNumberOfAnswers,
            message: messageNumberOfAnswers
        },
        _id: false
    },
    priority: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    bankId: {
        type: Schema.Types.ObjectId,
        ref: 'QuestionsBank',
        required:true
    }
});

module.exports = mongoose.model('Question', questionSchema);
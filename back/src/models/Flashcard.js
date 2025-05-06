const mongoose = require('mongoose');
const { Schema } = mongoose;
const {
    isStringLengthGreaterThanZero,
    messageStringLengthGreaterThanZero
} = require('../lib/db/validatorFunctions.js');

const flashCardSchema = Schema({
    front: {
        type: String,
        required: true
    },
    back: {
        type: String,
        required: true
    },
    nextReview: {
        type: Date,
        default: null
    },
    lastReview: {
        type: Date,
        default: null
    },
    interval: {
        type: Number,
        default: 0
    },
    quality: {
        type: Number,
        default: 0
    },
    easeFactor: {
        type: Number,
        default: 2.5
    },
    isActive: {
        type: Boolean,
        default: true
    },
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    bankId: {
        type: Schema.Types.ObjectId,
        ref: 'Bank',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Flashcard', flashCardSchema);

const mongoose = require('mongoose');
const {type} = require("mocha/lib/utils");
const { Schema } = mongoose;

const studySessionSchema = Schema({
    bankId: {
        type: Schema.Types.ObjectId,
        ref: 'Bank',
        required: true
    },
    kidId: {
        type: Schema.Types.ObjectId,
        ref: 'Kid',
        required: true
    },
    cards: {
        type: [
            {
                flashcardId: { type: Schema.Types.ObjectId, required: true },
                status: { type: Number, required: true, default: 0}
            }
        ],
        required: true,
        validate: {
            validator: function (value) {
                return Array.isArray(value) && value.length  >= 0;
            },
            message: 'Study session must have at least one flashcard'
        },
        _id: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('StudySession', studySessionSchema);
const mongoose = require('mongoose');
const {ObjectId} = require("mongodb");

const QuestionsBankSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    questions: [{ type: ObjectId }]
});

module.exports = mongoose.model('QuestionsBank', QuestionsBankSchema);
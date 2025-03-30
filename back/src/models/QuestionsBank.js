const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionsBankSchema = Schema({
    name:  { type: String, required: true },
    guardianId: { type: Schema.Types.ObjectId, ref: 'Guardian', required: true }
});

module.exports = mongoose.model('QuestionsBank', questionsBankSchema);
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const kidSchema = Schema({
    name:{ type: String, required: true },
    coins: { type: Number, required: true },
    streak: {type: Number, default: 0},
    guardianId: { type: Schema.Types.ObjectId, ref: 'Guardian', required: true }
});

module.exports = mongoose.model('Kid', kidSchema);
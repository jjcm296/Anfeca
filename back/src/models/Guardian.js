const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const guardianSchema = Schema({
    name:{ type: String, required: true },
    lastName: { type: String, required: true }
});

module.exports = mongoose.model('Guardian', guardianSchema)
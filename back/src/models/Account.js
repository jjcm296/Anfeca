const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const bycrypt = require('bcrypt');

const accountSchema = Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    guardianId: { type: Schema.Types.ObjectId, ref: 'Guardian', required: true }
});

module.exports = mongoose.model('Account', accountSchema)
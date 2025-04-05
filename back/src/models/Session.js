const mongoose = require('mongoose');
const { Schema } = mongoose;
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const sessionSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    refreshToken: {
        type:String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Session', sessionSchema);
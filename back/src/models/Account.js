const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const { isValidEmail,
    messageInvalidEmail,
    isStrongPassword,
    messageWeakPassword } = require('../lib/validatorFunctions.js')

const accountSchema = Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: isValidEmail,
            message: messageInvalidEmail
        }
    },
    password: {
        type: String,
        required: true,
        select: false,
        validate: {
            validator: isStrongPassword,
            message: messageWeakPassword
        }
    },
    guardianId: { type: Schema.Types.ObjectId, ref: 'Guardian', required: true }
});

accountSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

module.exports = mongoose.model('Account', accountSchema)
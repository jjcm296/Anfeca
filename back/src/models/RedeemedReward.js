const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const { Schema } = mongoose;

const redeemedRewardSchema = Schema({
    redeemDate: {
        type: Date,
        required: true,
        default: () => new Date(),
        immutable: true
    },
    confirmDate: {
        type: Date
    },
    confirm: {
        type: Boolean,
        default: false,
        required: true
    },
    rewardId : {
        type: Schema.Types.ObjectId,
        ref: 'Reward',
        required: true,
        immutable: true
    },
    guardianId : {
        type: Schema.Types.ObjectId,
        ref: 'Guardian',
        required: true,
        immutable: true
    }
}, {
    strict: 'throw'
});

redeemedRewardSchema.virtual('redeemDateFormatted').get(function () {
    return DateTime
        .fromJSDate(this.redeemDate, { zone: 'America/Mexico_City' })
        .toFormat('dd-MM-yyyy HH:mm');
});

redeemedRewardSchema.virtual('checkDateFormatted').get(function () {
    return this.confirmDate
        ? DateTime.fromJSDate(this.confirmDate, { zone: 'America/Mexico_City' })
            .toFormat('dd-MM-yyyy HH:mm')
        : null;
});

module.exports = mongoose.model('RedeemedReward', redeemedRewardSchema);
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
    checkDate: {
        type: Date,
        immutable: true
    },
    checked: {
        type: Boolean,
        default: false,
        required: true
    },
    rewardId : {
        type: Schema.Types.ObjectId,
        ref: 'Reward',
        required: true
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
    return this.checkDate
        ? DateTime.fromJSDate(this.checkDate, { zone: 'America/Mexico_City' })
            .toFormat('dd-MM-yyyy HH:mm')
        : null;
});

module.exports = mongoose.model('RedeemedReward', redeemedRewardSchema);
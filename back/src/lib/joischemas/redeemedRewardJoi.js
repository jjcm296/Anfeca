const Joi = require('joi');
const mongoose = require('mongoose');

const isValidObjectId = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

const redeemedRewardSchemaJoi = Joi.object({
    redeemDate: Joi.date().required(),
    checkDate: Joi.date().required(),
    checked: Joi.boolean().required(),
    rewardId: Joi.custom(isValidObjectId).required()
}).strict();

module.exports = {
    redeemedRewardSchemaJoi
};
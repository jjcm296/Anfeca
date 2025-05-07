const Joi = require('joi');
const mongoose = require('mongoose');

const isValidObjectId = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

const newGameSchema = Joi.object({
    bankId: Joi.custom(isValidObjectId).required(),
    kidId: Joi.custom(isValidObjectId).required(),
    questions: Joi.array()
        .items(
            Joi.object({
                questionId: Joi.custom(isValidObjectId).required(),
                answeredCorrectly: Joi.boolean().allow(null).default(null)
            })
        )
        .length(5)
        .required(),
    individualCoins: Joi.number().integer().min(0).default(0)
}).unknown(false);

const finishedGameSchema = Joi.object({

});

module.exports = {
    newGameSchema
};

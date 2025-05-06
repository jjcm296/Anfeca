const Joi = require('joi');
const mongoose = require('mongoose');

const isValidObjectId = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

const studySessionSchema = Joi.object({
    bankId: Joi.custom(isValidObjectId).required(),
    kidId: Joi.custom(isValidObjectId).required(),
    cards: Joi.array()
        .items(
            Joi.object({
                flashcardId: Joi.custom(isValidObjectId).required(),
                status: Joi.number().integer().min(0).required()
            })
        )
        .min(5)
        .required()
});

module.exports = {
    studySessionSchema
}

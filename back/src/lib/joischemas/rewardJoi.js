const Joi = require('joi');

const createRewardSchema = Joi.object({
    name: Joi.string().trim().min(1).required(),

    price: Joi.number().greater(0).required(),

    type: Joi.string().valid('forever', 'once', 'custom').required(),

    redemptionLimit: Joi.alternatives().conditional('type', [
        {
            is: 'once',
            then: Joi.valid(1).required().messages({
                'any.only': "If type is 'once', redemptionLimit must be 1"
            })
        },
        {
            is: 'forever',
            then: Joi.forbidden().messages({
                'any.unknown': "If type is 'forever', redemptionLimit must not be provided"
            })
        },
        {
            is: 'custom',
            then: Joi.number().greater(0).required().messages({
                'number.greater': "If type is 'custom', redemptionLimit must be greater than 0"
            })
        }
    ])
}).unknown(false);

const updateRewardSchema = Joi.object({
    name: Joi.string().trim().min(1),

    price: Joi.number().greater(0),

    type: Joi.string().valid('forever', 'once', 'custom'),

    redemptionLimit: Joi.number().greater(0)
})
    .custom((value, helpers) => {
        const { type, redemptionLimit } = value;

        if (type === 'once' && redemptionLimit !== undefined && redemptionLimit !== 1) {
            return helpers.error('any.invalid', { message: "If type is 'once', redemptionLimit must be 1" });
        }

        if (type === 'forever' && redemptionLimit !== undefined) {
            return helpers.error('any.invalid', { message: "If type is 'forever', redemptionLimit must not be provided" });
        }

        if (type === 'custom' && (redemptionLimit === undefined || redemptionLimit <= 0)) {
            return helpers.error('any.invalid', { message: "If type is 'custom', a valid redemptionLimit is required" });
        }

        return value;
    }, 'Reward type vs redemptionLimit validation')
    .unknown(false);

module.exports = {
    createRewardSchema,
    updateRewardSchema
}
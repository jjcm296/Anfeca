const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().trim().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])'))
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long.',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            'string.empty': 'Password is required.'
        })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])'))
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long.',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            'string.empty': 'Password is required.'
        })
});

const verificationCodeSchema = Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().length(6).pattern(/^\d+$/).required()
        .messages({
            'string.min': 'Code must be at least 6 digits',
            'string': 'Code must be a string',
            'string.pattern.base': 'Code must contain digits'
        })
});

const verifyEmail = Joi.object({
    email: Joi.string().email().required()
});

const verifyPassword = Joi.object({
    password: Joi.string().min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])'))
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long.',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            'string.empty': 'Password is required.'
        })
});


module.exports =  {
    registerSchema,
    loginSchema,
    verificationCodeSchema,
    verifyEmail,
    verifyPassword
};
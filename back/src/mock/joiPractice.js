const Joi = require('joi');


/*
const schema = Joi.object({
   username: Joi.string()
       .alphanum()
       .min(3)
       .max(30)
       .required(),

   password: Joi.string()
       .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) ,

   repeat_password: Joi.ref('password'),

    access_token: [
        Joi.string(),
        Joi.number()
    ],

    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2013)
    ,

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
    .with('username', 'birth_year')
    .xor('password', 'access_token')
    .with('password', 'repeat_password');


// -> { value: { username: 'abc', birth_year: 1994 } }

schema.validate({});
// -> { value: {}, error: '"username" is required' }

// Also -

const object = {
    username: 'abc',
    birth_year: 1994,
    password: 'hola',
    repeat_password: 'mayate'
}

const validation = schema.validate(object)

console.log(validation)

 */

const base = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

/*
let object = {
    name: 23
}

 */

module.exports = base;
const ob = require('./joiPractice');

let object = {
    email: "hola@example.com",
    password: "1234567"
}

console.log(ob.validateAsync(object))
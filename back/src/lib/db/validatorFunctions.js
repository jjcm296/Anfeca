function isStringLengthGreaterThanZero(text) {
    return typeof text === 'string' && text.trim().length > 0
}
const messageStringLengthGreaterThanZero = "string length must be greater than zero";

function isGreaterThanZero(number) {
    return number > 0;
}
const messageGreaterThanZero = "must be greater than 0";

function isZeroOnInsertOnly(value) {
    return this.isNew ? value === 0 : true;
}
const messageMustBeZeroOnInsert = "value must be 0 on creation";

function validateNumberOfAnswers(answersArray) {
    // min 2 answers, max 4 answers
    if (answersArray.length < 2 || answersArray.length > 4) return false;

    // at least 1 correct answer and 1 incorrect answer
    const numberOfCorrects = answersArray.filter( a => a.isCorrect ).length;
    const numberOfIncorrects = answersArray.filter(a => !a.isCorrect).length;

    return numberOfCorrects >= 1 && numberOfIncorrects >= 1;
}
const messageNumberOfAnswers = "Answers must include at least one correct and one incorrect answer (2–4 total)";

// Email format
function isValidEmail(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
}
const messageInvalidEmail = "Invalid email format";

// Password strength
function isStrongPassword(value) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(value);
}
const messageWeakPassword = "Password must be at least 8 characters and include lowercase, uppercase, number, and special character";



module.exports = {
    isStringLengthGreaterThanZero,
    messageStringLengthGreaterThanZero,
    isGreaterThanZero,
    messageGreaterThanZero,
    isZeroOnInsertOnly,
    messageMustBeZeroOnInsert,
    validateNumberOfAnswers,
    messageNumberOfAnswers,
    isValidEmail,
    messageInvalidEmail,
    isStrongPassword,
    messageWeakPassword
};
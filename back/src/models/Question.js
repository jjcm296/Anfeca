const mongoose = require('mongoose');
const { Schema } = mongoose;

function requiredNumberOfAnswers(answersArray) {
    // min 2 answers, max 4 answers
    if (answersArray.length < 2 || answersArray.length > 4) return false;

    // at least 1 correct answer and 1 incorrect answer
    const numberOfCorrects = answersArray.filter( a => a.isCorrect ).length;
    const numberOfIncorrects = answersArray.filter(a => !a.isCorrect).length;

    return numberOfCorrects >= 1 && numberOfIncorrects >= 1;
}

const questionSchema = Schema({
    textQuestion: { type: String, required: true },
    answers: {
        type: [
            {
                textAnswer:{ type: String, required: true },
                isCorrect: { type: Boolean, required: true }
            }
        ],
        validate: {
            validator: requiredNumberOfAnswers,
            message: 'Answers must include at least one correct and one incorrect answer (2–4 total).'
        },
        _id: false
    },
    priority: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    questionBankId: {
        type: Schema.Types.ObjectId,
        ref: 'QuestionBank',
        required:true
    }
});

module.exports = mongoose.model('Question', questionSchema);
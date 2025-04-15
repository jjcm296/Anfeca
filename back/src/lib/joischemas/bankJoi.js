const Joi = require('joi');

const createBankSchema = Joi.object({
   name: Joi.string().trim().min(2).required()
});

const createQuestionSchema = Joi.object({
   textQuestion: Joi.string().trim().min(1).required(),
   answers: Joi.array()
       .items(
           Joi.object({
              textAnswer: Joi.string().trim().min(1).required(),
              isCorrect: Joi.boolean().required()
           })
       )
       .min(2)
       .max(4)
       .custom((answers, helpers) => {
          const hasCorrect = answers.some(a => a.isCorrect === true);
          const hasIncorrect = answers.some(a => a.isCorrect === false);

          if (!hasCorrect || !hasIncorrect) {
             return helpers.message(
                 'Answers must include at least one correct and one incorrect answer'
             );
          }

          return answers;
       })
       .required()
       .messages({
          'array.min': 'Must contain at least 2 answers',
          'array.max': 'Must contain a maximum 4 of answers',
       })
   ,
   priority: Joi.number().valid(1,2,3).required()
});

module.exports = {
   createBankSchema,
   createQuestionSchema
}
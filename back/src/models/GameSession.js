const mongoose = require('mongoose');
const {boolean} = require("joi");
const { Schema } = mongoose;

const gameSessionSchema = Schema({
   bankId: {
       type: Schema.Types.ObjectId,
       ref: 'Bank',
       required: true
   },
   kidId: {
       type: Schema.Types.ObjectId,
       ref: 'Kid',
       required: true
   },
   questions: {
       type: [
           {
               questionId: { type: Schema.Types.ObjectId, required: true },
               answeredCorrectly: { type: Boolean, default: null }
           }

       ],
       required: true,
       validate: {
           validator: function (value) {
               return Array.isArray(value) && value.length >= 0 && value.length <= 5;
           },
           message: 'Game session must have 5 questions'
       }
   },
   individualCoins: {
      type: Number,
      required: true,
      default:0
   },
   status: {
       type: Boolean,
       default: null
   }
}, {
    timestamps: true
});

module.exports = mongoose.model('GameSession', gameSessionSchema);
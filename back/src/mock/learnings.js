const mongoose = require("mongoose");
const { Schema } = require("mongoose");

mongoose.connect("mongodb+srv://anfecaconcentratda:Password321@cluster0.jxijpiz.mongodb.net/test"
).then(()=> {
    console.log('Successfully connected to MongoDB');
}).catch(err => {
    console.error('Unable to connect to MongoDB:', err);
});


function validator(answersArray) {
    if (answersArray.length < 2 || answersArray.length > 4) return false;

    const numberOfCorrects = answersArray.filter( a => a.isCorrect ).length;
    const numberOfIncorrects = answersArray.filter(a => !a.isCorrect).length;

    return numberOfCorrects >= 1 && numberOfIncorrects >= 1;
}

const questSchema = Schema({
    textQuestion: { type: String, required: true },
    answers: {
        type: [
            {
                textAnswer:{ type: String, required: true },
                isCorrect: { type: Boolean, required: true }
            }
        ],
        validate: validator,
        _id: false
    },
    priority: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    }
});



const questModel = mongoose.model('Quest', questSchema);

const document = {
    textQuestion: "mayate",
    answers: [
        {textAnswer:"si", isCorrect: true},
        {textAnswer:"si", isCorrect: true},
        {textAnswer:"si", isCorrect: true},
        {textAnswer:"no", isCorrect: false},
        {textAnswer:"no", isCorrect: false}
    ],
    priority:2
};


const insert = async () => {
     await questModel.insertOne(document);
}

insert();
const mongoose = require('mongoose');
const connectToDB = require('../lib/dbConnection.js');
const QuestionsBank = require('./QuestionsBank');

const insertQuestionsBanks = async () => {
    await connectToDB();

    /*
    const banks = [
        { name: 'Math Basics', questions: [] },
        { name: 'Reading Skills', questions: [] },
    ];

    try {
        const result = await QuestionsBank.insertMany(banks);
        console.log('Inserted:', result);
    } catch (err) {
        console.error('Insert error:', err);
    } finally {
        mongoose.disconnect();
    }

     */
};

insertQuestionsBanks();

const mongoose = require('mongoose');
const connectToDB = require('../lib/db/dbConnection.js');
const questioBank = require('../models/QuestionsBank')
const { ObjectId } = require("mongodb");

const insert = async () => {
    await connectToDB();

    /*
    const docGuardian = {
        name: "Marta",
        lastName: "Del Valle"
    };

    const documentAccount = {
        email: 'something@something',
        password: 'kkmkmkk',
        guardianId: new ObjectId('67e97ab60fd5e5b116a45635')
    };

    const docKid = {
        name: "pepito",
        guardianId: new ObjectId ('67e97ab60fd5e5b116a45635')
    };
     */

    const doc = {
        name: '   ',
        guardianId: new ObjectId('67e97ab60fd5e5b116a45635')
    }

    try {
        const result = await questioBank.create(doc);
        console.log('Inserted:', result);
    } catch (err) {
        console.error('Insert error:', err);
    } finally {
        mongoose.disconnect();
    }

};

insert();

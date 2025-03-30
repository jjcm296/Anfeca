const mongoose = require('mongoose');
const connectToDB = require('../lib/dbConnection.js');
const rewards = require('./Reward');
const { ObjectId } = require("mongodb");

const insert = async () => {
    await connectToDB();

    const document = {
        name: 'Watch TikTok for 30 mins'
    };


    try {
        const result = await rewards.create(document);
        console.log('Inserted:', result);
    } catch (err) {
        console.error('Insert error:', err);
    } finally {
        mongoose.disconnect();
    }

};

insert();

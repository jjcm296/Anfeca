const express = require('express');
const http = require('http');
const cors = require('cors');
const connectToDB = require('./dbConnection.js');
const mongoose = require("mongoose");
require('dotenv').config({ path: '../.env' });

const app = express();

const initializeApp = async () => {
    try {
        const dbConnection = await connectToDB();

        app.use(express.json());

        app.get('/', (req, res) => {
            const state = mongoose.connection.readyState;
            const status = state === 1 ? 'Connected' : 'Disconnected';
            res.send(`Database connection state: ${status}`);
            // readyState values:
            // 0 = disconnected
            // 1 = connected
            // 2 = connecting
            // 3 = disconnecting
        });

        const port = process.env.PORT || 3001
        const server = app.listen(port, ()=>{
           console.log(`Server running on port ${port}`);
           console.log(`MongoDB readyState: ${mongoose.connection.readyState}`);
        });

        return { app, server, dbConnection };

    } catch (error) {
        console.error('Fatal initialization error:', error);
        process.exit(1);
    }

};

initializeApp();

module.exports = { app, initializeApp };
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectToDB = require('dbConnection');
require('dotenv').config();

const app = express();

//connectToDB();

const port = process.env.PORT;

app.get('/', (req,res)=> {
    res.send('Hello world!')
});

app.listen(port, () => {
    console.log(`Example app listenning on port ${port}`)
})
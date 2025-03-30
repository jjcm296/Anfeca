const mongoose = require('mongoose');

require('dotenv').config({ path: '../.env' });

const stringConnection = process.env.DB_URI;

const connectToDB = () => {
  mongoose.connect(stringConnection)
      .then(()=> {
          console.log('Successfully connected to MongoDB');
      }).catch(err => {
          console.error('Unable to connect to MongoDB:', err);
      });
};

module.exports = connectToDB;

/*
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
   serverApi: {
       version: ServerApiVersion.v1,
       strict:true,
       deprecationErrors:true,
   }
});

let dbInstance = null;

const connectToDB = async () => {
    try {
        await client.connect();
        await client.db("admin").command({ ping:1 });
        console.log("Succesfully connected to MongoDB")

        dbInstance = client.db(process.env.DB_NAME);

    } catch (err) {
        console.error('Unable to connect to MongoDB:', err);
        throw err;
    }

};

const getDB = () => {
    if (!dbInstance) throw new Error('Database not connected!')
    return dbInstance;
};

module.exports = {
    connectToDB,
    getDB
};

 */
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
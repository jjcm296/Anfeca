const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

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
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const ENV = process.env.NODE_ENV || 'development';

const dbUri = ENV === 'test' ? process.env.TEST_DB_URI : process.env.DB_URI;

const connectToDB = () => {
  mongoose.connect(dbUri)
      .then(()=> {
          console.log(`Successfully connected to MongoDB ${ENV}`);
      }).catch(err => {
          console.error('Unable to connect to MongoDB:', err);
      });
};

module.exports = connectToDB;
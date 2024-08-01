const mongoose = require('mongoose');
require('dotenv').config();

const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB database');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const mongoose = require('mongoose');

require('dotenv').config();

const DB_URI = process.env.DB_URI; // MongoDB connection URI from your .env

// Database connection options
// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// };

// Establish MongoDB connection
mongoose.connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Export the connection for use in other parts of your application
module.exports = mongoose.connection;

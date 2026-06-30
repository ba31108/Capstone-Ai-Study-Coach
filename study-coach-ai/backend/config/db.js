const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Check: 1) MONGO_URI in .env  2) IP whitelisted in Atlas Network Access  3) Database user credentials in Atlas Database Access');
    process.exit(1);
  }
};

module.exports = connectDB;

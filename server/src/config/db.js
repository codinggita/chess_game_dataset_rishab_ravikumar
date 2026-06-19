const mongoose = require('mongoose');
const env = require('./env');
const Match = require('../models/Match');
const seedAll = require('../scripts/seedMatches');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed if Match collection is empty
    const count = await Match.countDocuments();
    if (count === 0) {
      console.log('Match collection is empty. Auto-seeding database...');
      await seedAll(false);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

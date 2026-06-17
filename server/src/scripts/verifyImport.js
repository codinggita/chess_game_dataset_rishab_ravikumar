require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Match = require('../models/Match');

async function verify() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const total = await Match.countDocuments({ isDeleted: false });
  
  const byWinner = await Match.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$winner', count: { $sum: 1 } } },
  ]);
  
  const byStatus = await Match.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$victory_status', count: { $sum: 1 } } },
  ]);
  
  const sample = await Match.findOne().select('id winner rated victory_status');
  const duplicates = await Match.countDocuments({ isDeleted: false, id: { $exists: true } });
  
  console.log('=== Import Verification ===');
  console.log('Total matches (isDeleted: false):', total);
  console.log('With id field:', duplicates);
  console.log('\nBy winner:', JSON.stringify(byWinner, null, 2));
  console.log('\nBy status:', JSON.stringify(byStatus, null, 2));
  console.log('\nSample doc:', sample);
  
  await mongoose.disconnect();
  process.exit(0);
}

verify().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

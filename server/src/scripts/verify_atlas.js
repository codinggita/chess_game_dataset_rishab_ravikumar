const mongoose = require('mongoose');

const URI = 'mongodb://rishabchandgothiacg_db_user:rishab25nov@ac-dhjjvkk-shard-00-00.iwhvfnb.mongodb.net:27017,ac-dhjjvkk-shard-00-01.iwhvfnb.mongodb.net:27017,ac-dhjjvkk-shard-00-02.iwhvfnb.mongodb.net:27017/chess?ssl=true&replicaSet=atlas-mo37rj-shard-0&authSource=admin&appName=Cluster0';

async function verify() {
  try {
    await mongoose.connect(URI);
    console.log('Connected to Atlas');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check 'moves' collection if exists
    if (collections.find(c => c.name === 'moves')) {
      const sample = await mongoose.connection.db.collection('moves').findOne();
      console.log('Sample Document (keys):', Object.keys(sample));
      console.log('Turns type:', typeof sample.turns, `Value: ${sample.turns}`);
      console.log('Created_at type:', typeof sample.created_at, `Value: ${sample.created_at}`);
    } else {
      console.log('Collection "moves" not found.');
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

verify();

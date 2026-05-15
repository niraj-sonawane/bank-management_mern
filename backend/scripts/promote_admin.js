const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const emailToPromote = process.argv[2];

if (!emailToPromote) {
  console.error('Usage: node promote_admin.js <email>');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/banking_sim')
  .then(async () => {
    const user = await User.findOneAndUpdate(
      { email: emailToPromote },
      { role: 'admin' },
      { new: true }
    );
    if (user) {
      console.log(`✅ User ${emailToPromote} promoted to admin.`);
    } else {
      console.log(`❌ User ${emailToPromote} not found.`);
    }
    await mongoose.connection.close();
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

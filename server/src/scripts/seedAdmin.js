/**
 * seedAdmin.js — Run once to create the initial admin account.
 * Usage: node src/scripts/seedAdmin.js
 *
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env (or env vars).
 * Safe to re-run — skips if admin already exists.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@chess.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@1234';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Super Admin';

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`Updated existing user "${ADMIN_EMAIL}" to admin role.`);
    } else {
      console.log(`Admin "${ADMIN_EMAIL}" already exists. Nothing to do.`);
    }
    await mongoose.disconnect();
    return;
  }

  const admin = new User({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
    emailVerified: true,
  });

  await admin.save();
  console.log(`✓ Admin created: ${ADMIN_EMAIL}`);
  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});

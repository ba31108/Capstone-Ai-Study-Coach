'use strict';

/**
 * Seed script — creates an admin user.
 * Usage: npm run seed:admin
 * Reads from environment variables:
 *   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } = process.env;

if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('ERROR: Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in backend/.env before running this script.');
  process.exit(1);
}

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is not set in backend/.env');
  process.exit(1);
}

(async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role === 'admin') {
      console.log(`Admin already exists: ${existing.email}`);
    } else {
      existing.role = 'admin';
      existing.name = ADMIN_NAME;
      await existing.save();
      console.log(`Updated existing user to admin: ${existing.email}`);
    }
  } else {
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`Admin created: ${admin.email}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
  process.exit(0);
})().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});

const mongoose = require('mongoose');
const User = require('../models/User');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing data
    await User.deleteMany({});

    // Create test users
    const users = await User.insertMany([
      {
        username: 'testuser1',
        email: 'test1@example.com',
        password: 'password123'
      }
      // ... more test users
    ]);

    console.log('Database seeded!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();

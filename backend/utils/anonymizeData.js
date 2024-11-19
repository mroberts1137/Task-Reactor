const faker = require('faker');
const User = require('../models/User');

async function anonymizeUsers() {
  const users = await User.find();

  for (let user of users) {
    user.email = faker.internet.email();
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    // ... anonymize other sensitive fields
    await user.save();
  }

  console.log('User data anonymized');
}

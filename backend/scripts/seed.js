const sequelize = require('../config/database');
const User = require('../models/User');
const Event = require('../models/Event');
const bcrypt = require('bcrypt');

const seed = async () => {
  await sequelize.sync({ force: true });

  const hashedPassword = await bcrypt.hash('password', 10);

  await User.create({ email: 'admin@example.com', password: hashedPassword, role: 'admin' });
  await User.create({ email: 'user@example.com', password: hashedPassword, role: 'user' });

  await Event.create({ title: 'Event 1', description: 'Description 1', date: new Date(), maxParticipants: 10 });
  await Event.create({ title: 'Event 2', description: 'Description 2', date: new Date(Date.now() + 86400000), maxParticipants: 5 });

  console.log('Database seeded');
  process.exit();
};

seed();
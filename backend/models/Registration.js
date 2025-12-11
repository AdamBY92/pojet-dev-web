const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Event = require('./Event');

const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  eventId: {
    type: DataTypes.INTEGER,
    references: {
      model: Event,
      key: 'id',
    },
  },
});

User.hasMany(Registration);
Registration.belongsTo(User);
Event.hasMany(Registration);
Registration.belongsTo(Event);

module.exports = Registration;
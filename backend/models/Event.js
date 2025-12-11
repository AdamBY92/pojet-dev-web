const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  currentParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Event;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  initial_balance: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
  current_balance: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'ر.س',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'accounts',
  timestamps: true, // adds createdAt and updatedAt
});

module.exports = Account;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('owner', 'employee'),
    defaultValue: 'employee',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;

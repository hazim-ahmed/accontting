const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Installment = sequelize.define('Installment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  due_date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_paid: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'installments',
  timestamps: true,
});

module.exports = Installment;

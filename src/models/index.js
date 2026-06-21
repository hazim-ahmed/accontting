const User = require('./User');
const Account = require('./Account');
const Transaction = require('./Transaction');
const Installment = require('./Installment');

// Define relationships
Account.hasMany(Transaction, { foreignKey: 'account_id', onDelete: 'CASCADE' });
Transaction.belongsTo(Account, { foreignKey: 'account_id' });

Account.hasMany(Installment, { foreignKey: 'account_id', onDelete: 'CASCADE' });
Installment.belongsTo(Account, { foreignKey: 'account_id' });

module.exports = {
  User,
  Account,
  Transaction,
  Installment
};

const { sequelize } = require('../config/database');
const { Account, Transaction, Installment } = require('../models');

// Backup local data to cloud (MySQL)
const backup = async (req, res) => {
  const { accounts, transactions, installments } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(accounts) || !Array.isArray(transactions) || !Array.isArray(installments)) {
    return res.status(400).json({ message: 'بيانات المزامنة غير صالحة' });
  }

  const t = await sequelize.transaction();

  try {
    // 1. Delete all existing remote data for this specific tenant in order to satisfy foreign keys
    await Installment.destroy({ where: { userId }, transaction: t });
    await Transaction.destroy({ where: { userId }, transaction: t });
    await Account.destroy({ where: { userId }, transaction: t });

    // Enrich lists with the tenant's userId
    const enrichedAccounts = accounts.map(a => ({ ...a, userId }));
    const enrichedTransactions = transactions.map(tx => ({ ...tx, userId }));
    const enrichedInstallments = installments.map(inst => ({ ...inst, userId }));

    // 2. Bulk insert accounts
    if (enrichedAccounts.length > 0) {
      await Account.bulkCreate(enrichedAccounts, { transaction: t });
    }

    // 3. Bulk insert transactions
    if (enrichedTransactions.length > 0) {
      await Transaction.bulkCreate(enrichedTransactions, { transaction: t });
    }

    // 4. Bulk insert installments
    if (enrichedInstallments.length > 0) {
      await Installment.bulkCreate(enrichedInstallments, { transaction: t });
    }

    await t.commit();
    res.json({ success: true, message: 'تم النسخ الاحتياطي والمزامنة بنجاح' });
  } catch (error) {
    await t.rollback();
    console.error('Error during backup sync:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء مزامنة النسخ الاحتياطي', error: error.message });
  }
};

// Restore data from cloud (MySQL) to local
const restore = async (req, res) => {
  const userId = req.user.id;
  try {
    const accounts = await Account.findAll({ where: { userId }, order: [['id', 'DESC']] });
    const transactions = await Transaction.findAll({ where: { userId }, order: [['id', 'DESC']] });
    const installments = await Installment.findAll({ where: { userId }, order: [['id', 'ASC']] });

    res.json({
      success: true,
      accounts,
      transactions,
      installments
    });
  } catch (error) {
    console.error('Error during restore sync:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء استعادة البيانات', error: error.message });
  }
};

module.exports = {
  backup,
  restore
};

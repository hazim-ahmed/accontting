const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;

// Main sequelize instance
const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: 'mysql',
  logging: false,
});

const connectDB = async () => {
  try {
    // 1. Try to create the database if it doesn't exist (May fail in cloud environments due to permissions, which is fine if DB already exists)
    try {
      const rawSequelize = new Sequelize('', dbUser, dbPass, {
        host: dbHost,
        dialect: 'mysql',
        logging: false,
      });
      await rawSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
      await rawSequelize.close();
    } catch (createError) {
      console.log('Skipped database creation (likely already exists or no permission in cloud):', createError.message);
    }

    // 2. Authenticate main connection
    await sequelize.authenticate();
    console.log('MySQL Database Connected successfully via Sequelize.');

    // 3. Sync models
    await sequelize.sync({ alter: true });
    console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectDB };

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT || 3306,
    logging: false, 
  }
);


(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully...');
     await sequelize.sync({ alter: true });
    console.log('All tables synced successfully!');
  } catch (err) {
    console.error(' Unable to connect to the database:', err);
  }
})();

module.exports = sequelize;



const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('task_manager', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;



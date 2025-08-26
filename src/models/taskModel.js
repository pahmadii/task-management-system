const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');

const Task = sequelize.define('Task', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  attachment: { type: DataTypes.STRING, allowNull: true }, // برای ذخیره مسیر یا URL پیوست
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, { timestamps: true });

module.exports = Task;
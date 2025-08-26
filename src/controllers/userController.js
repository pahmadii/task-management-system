const User = require('../models/userModel');
const Task = require('../models/taskModel');
const { ROLES } = require('../utils/constants');
const sendResponse = require("../utils/response");
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');


const userController = {

  // لیست همه کاربران
 getAllUsers: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit,
      offset,
    });

    logger.info(`Users retrieved by admin: ${req.user.id}, Page: ${page}, Limit: ${limit}`); // لاگ اطلاعاتی
    return sendResponse(res, 200, 'Users retrieved', {
      total: count,
      page,
      limit,
      data: rows,
    });
  },
  // بروزرسانی اطلاعات کاربر
 updateUser: async (req, res) => {
    const { email, phone } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return sendResponse(res, 404, 'User not found');

    await user.update({ email, phone });
    logger.info(`User updated by admin: ${req.user.id}, User: ${user.username}, ID: ${user.id}`); // لاگ اطلاعاتی

    const { password, ...safeUser } = user.toJSON();
    return sendResponse(res, 200, 'User updated', safeUser); 
  },

  // تغییر نقش کاربر
  changeUserRole: async (req, res) => {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) return sendResponse(res, 400, 'Invalid role');

    const user = await User.findByPk(req.params.id);
    if (!user) return sendResponse(res, 404, 'User not found');

    await user.update({ role });

    logger.info(`User role changed by admin: ${req.user.id}, User: ${user.username}, ID: ${user.id}, New Role: ${role}`); // لاگ اطلاعاتی

    const { password, ...safeUser } = user.toJSON();
    return sendResponse(res, 200, 'User role updated', safeUser);
  },

  // حذف کاربر و تسک‌ها
 deleteUser: async (req, res) => {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) return sendResponse(res, 404, 'User not found');
    const tasks = await Task.findAll({ where: { user_id: userId } });

    for (const task of tasks) {
      if (task.attachment && fs.existsSync(path.join(__dirname, '..', task.attachment))) {
        fs.unlinkSync(path.join(__dirname, '..', task.attachment));
      }
    }

    await Task.destroy({ where: { user_id: userId } });
    await user.destroy();

    logger.info(`User deleted by admin: ${req.user.id}, User: ${user.username}, ID: ${userId}`); // لاگ اطلاعاتی
    
    return sendResponse(res, 200, 'User and their tasks deleted');
  }

};

module.exports = userController;

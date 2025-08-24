const User = require('../models/userModel');
const Task = require('../models/taskModel');
const sendResponse = require("../utils/response");



const userController = {

  // لیست همه کاربران
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({ attributes: { exclude: ['password'] } });
      return sendResponse(res, 200, 'Users retrieved', users);
    } catch (err) {
    throw err;
    }
  },

  // بروزرسانی اطلاعات کاربر
  updateUser: async (req, res) => {
    try {
      const { username, email, phone } = req.body;
      const user = await User.findByPk(req.params.id);
      if (!user) return sendResponse(res, 404, 'User not found');

      await user.update({ username, email, phone });
      return sendResponse(res, 200, 'User updated', user);
    } catch (err) {
      throw err;
    }
  },

  // تغییر نقش کاربر
  changeUserRole: async (req, res) => {
    try {
      const { role } = req.body;
      if (!['admin', 'user'].includes(role)) return sendResponse(res, 400, 'Invalid role');

      const user = await User.findByPk(req.params.id);
      if (!user) return sendResponse(res, 404, 'User not found');

      await user.update({ role });
      return sendResponse(res, 200, 'User role updated', user);
    } catch (err) {
      throw err;
    }
  },

  // حذف کاربر و تسک‌ها
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);
      if (!user) return sendResponse(res, 404, 'User not found');

      await Task.destroy({ where: { user_id: userId } });
      await user.destroy();
      return sendResponse(res, 200, 'User and their tasks deleted');
    } catch (err) {
      throw err;
    }
  }

};

module.exports = userController;

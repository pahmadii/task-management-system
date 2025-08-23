const express = require('express');
const router = express.Router();
const authorizeRoles = require('../middleware/authorizeRoles');
const userController = require('../controllers/userController');

// همه مسیرها فقط برای ادمین
router.use(authorizeRoles('admin'));

// دریافت لیست همه کاربران
router.get('/users', userController.getAllUsers);

// بروزرسانی کامل اطلاعات کاربر
router.put('/users/:id', userController.updateUser);

// تغییر نقش کاربر
router.patch('/users/:id/role', userController.changeUserRole);

// حذف کاربر و تمام تسک‌های او
router.delete('/users/:id', userController.deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const authorizeRoles = require('../middleware/authorizeRoles');
const userController = require('../controllers/userController');

// همه مسیرها فقط برای ادمین
router.use(authorizeRoles('admin'));

// دریافت لیست همه کاربران
router.get('/', userController.getAllUsers);

// بروزرسانی کامل اطلاعات کاربر
router.put('/:id', userController.updateUser);

// تغییر نقش کاربر
router.patch('/:id/role', userController.changeUserRole);

// حذف کاربر و تمام تسک‌های او
router.delete('/:id', userController.deleteUser);

module.exports = router;

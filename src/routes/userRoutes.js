const express = require('express');
const router = express.Router();
const authorizeRoles = require('../middleware/authorizeRoles');
const { adminUpdateUserValidation,changeRoleValidation} = require('../middleware/validators');
const userController = require('../controllers/userController');



// دریافت لیست همه کاربران
router.get('/', authorizeRoles('admin'), userController.getAllUsers);
// بروزرسانی کامل اطلاعات کاربر
router.put('/:id', authorizeRoles('admin'), adminUpdateUserValidation, userController.updateUser);
// تغییر نقش کاربر
router.patch('/:id/role', authorizeRoles('admin'), changeRoleValidation, userController.changeUserRole);

// حذف کاربر و تمام تسک‌های او
router.delete('/:id', authorizeRoles('admin'), userController.deleteUser);


module.exports = router;

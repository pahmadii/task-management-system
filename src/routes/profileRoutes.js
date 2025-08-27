const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { updateProfileValidation, changePasswordValidation } = require('../middleware/validators');
const authorizeRoles = require('../middleware/authorizeRoles');
const { upload } = require('../middleware/upload');

// فقط کاربران لاگین‌شده (user یا admin)
router.use(authorizeRoles('user', 'admin'));

// آپدیت پروفایل
router.put('/', updateProfileValidation, profileController.updateProfile);

// آپلود عکس پروفایل
router.post('/image', upload.single('image'), profileController.uploadProfileImage);

// دانلود عکس پروفایل
router.get('/download', profileController.downloadProfileImage);

// تغییر پسورد
router.put('/password', changePasswordValidation, profileController.changePassword);

module.exports = router;

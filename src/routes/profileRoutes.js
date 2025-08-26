const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { updateProfileValidation,changePasswordValidation} = require('../middleware/validators');
const authorizeRoles = require('../middleware/authorizeRoles');
const upload = require('../middleware/upload');

// فقط کاربران لاگین‌شده (user یا admin) می‌تونن به این مسیرها دسترسی داشته باشن
router.use(authorizeRoles('user', 'admin'));

router.put('/', updateProfileValidation, profileController.updateProfile);
router.post('/image', upload.single('image'), profileController.uploadProfileImage);
router.get('/download', profileController.downloadProfileImage);
router.put('/password', changePasswordValidation, profileController.changePassword);


module.exports = router;
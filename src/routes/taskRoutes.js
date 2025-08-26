const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { taskValidation } = require('../middleware/validators');
const authorizeRoles = require('../middleware/authorizeRoles');
const upload = require('../middleware/upload');

// فقط کاربران لاگین‌شده (user یا admin) می‌تونن به این مسیرها دسترسی داشته باشن
router.use(authorizeRoles('user', 'admin'));

router.post('/', taskValidation, upload.single('attachment'), taskController.createTask);
router.put('/:id', taskValidation, upload.single('attachment'), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/:id', taskController.getTask);
router.get('/', taskController.getAllTasks);
router.get('/:id/attachment', taskController.downloadTaskAttachment);

module.exports = router;
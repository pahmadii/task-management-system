const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { taskValidation } = require("../middleware/validators");
const authorizeRoles = require("../middleware/authorizeRoles");
const { upload } = require("../middleware/upload"); //همان upload.js برای همه فایل‌ها

// فقط کاربران لاگین‌شده

router.use(authorizeRoles("user", "admin"));

//  استفاده از upload.single('attachment') برای اضافه کردن فایل
router.post(
  "/",
  upload.single("attachment"), // key فایل Form-Data 'attachment'
  taskValidation,
  taskController.createTask
);

//آپلود فایل جدید در ویرایش تسک
router.put(
  "/:id",
  upload.single("attachment"),
  taskValidation,
  taskController.updateTask
);

router.delete("/:id", taskController.deleteTask);
router.get("/:id", taskController.getTask);
router.get("/", taskController.getAllTasks);
router.get("/:id/attachment", taskController.downloadTaskAttachment); //دانلود attachment

module.exports = router;

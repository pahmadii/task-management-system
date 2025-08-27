const Task = require("../models/taskModel");
const sendResponse = require("../utils/response");
const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");

const taskController = {
  
  //ساخت تسک

  createTask: async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;

    // مسیر نسبی ذخیره می‌کنیم نه مسیر کامل

    const attachment = req.file
      ? path.join("uploads", req.file.filename)
      : null;

    const task = await Task.create({
      name,
      description,
      attachment,
      user_id: userId,
    });

    logger.info(
      `Task created by user: ${userId}, Task: ${task.name}, ID: ${task.id}`
    );
    return sendResponse(res, 201, "Task created", task);
  },

  // بروزرسانی تسک

  updateTask: async (req, res) => {
    const { name, description } = req.body;
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!task) return sendResponse(res, 404, "Task not found or unauthorized");

    let attachment = task.attachment;

    if (req.file) {
      // استفاده از مسیر نسبی برای فایل جدید

      if (task.attachment) {
        const oldFilePath = path.join(__dirname, "..", task.attachment); // مسیر کامل فایل قبلی
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      attachment = path.join("uploads", req.file.filename); // مسیر نسبی فایل جدید
    }

    await task.update({ name, description, attachment });

    logger.info(
      `Task updated by user: ${req.user.id}, Task: ${task.name}, ID: ${task.id}`
    );
    return sendResponse(res, 200, "Task updated", task);
  },
  //پاک کردن تسک

  deleteTask: async (req, res) => {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!task) return sendResponse(res, 404, "Task not found or unauthorized");

    // استفاده از مسیر نسبی برای حذف فایل
    if (task.attachment) {
      const filePath = path.join(__dirname, "..", task.attachment);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await task.destroy();

    logger.info(
      `Task deleted by user: ${req.user.id}, Task ID: ${req.params.id}`
    );
    return sendResponse(res, 200, "Task deleted");
  },

  // خواندن و دریافت تسک

  getTask: async (req, res) => {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!task) return sendResponse(res, 404, "Task not found or unauthorized");

    logger.info(`Task retrieved by user: ${req.user.id}, Task ID: ${task.id}`);
    return sendResponse(res, 200, "Task retrieved", task);
  },

  // دریافت تمام کاربران تسک

  getAllTasks: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;

    const { count, rows } = await Task.findAndCountAll({
      where: { user_id: req.user.id },
      limit,
      offset,
    });

    logger.info(
      `Tasks retrieved by user: ${req.user.id}, Page: ${page}, Limit: ${limit}`
    );
    return sendResponse(res, 200, "Tasks retrieved", {
      total: count,
      page,
      limit,
      data: rows,
    });
  },

  //دانلود تسک attachment

  downloadTaskAttachment: async (req, res) => {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!task || !task.attachment)
      return sendResponse(res, 404, "Attachment not found");

    //مسیر کامل فایل از مسیر نسبی ساخته می‌شود
    const filePath = path.join(__dirname, "..", task.attachment);

    if (!fs.existsSync(filePath))
      return sendResponse(res, 404, "File not found");

    logger.info(
      `Task attachment downloaded by user: ${req.user.id}, Task ID: ${task.id}, File: ${task.attachment}`
    );
    res.download(filePath);
  },
};

module.exports = taskController;

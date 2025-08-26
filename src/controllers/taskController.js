const Task = require("../models/taskModel");
const sendResponse = require("../utils/response");
const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");

const taskController = {
  createTask: async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;
    const attachment = req.file ? `uploads/${req.file.filename}` : null;

    const task = await Task.create({
      name,
      description,
      attachment,
      user_id: userId,
    });

    logger.info(
      `Task created by user: ${userId}, Task: ${task.name}, ID: ${task.id}`
    ); // لاگ اطلاعاتی

    return sendResponse(res, 201, "Task created", task);
  },

  updateTask: async (req, res) => {
    const { name, description } = req.body;
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!task) return sendResponse(res, 404, "Task not found or unauthorized");

    let attachment = task.attachment;
    if (req.file) {
      if (
        task.attachment &&
        fs.existsSync(path.join(__dirname, "..", task.attachment))
      ) {
        fs.unlinkSync(path.join(__dirname, "..", task.attachment));
      }
      attachment = `uploads/${req.file.filename}`;
    }
    await task.update({ name, description, attachment });

    logger.info(
      `Task updated by user: ${req.user.id}, Task: ${task.name}, ID: ${task.id}`
    ); // لاگ اطلاعاتی

    return sendResponse(res, 200, "Task updated", task);
  },

  deleteTask: async (req, res) => {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!task) return sendResponse(res, 404, "Task not found or unauthorized");

    if (
      task.attachment &&
      fs.existsSync(path.join(__dirname, "..", task.attachment))
    ) {
      fs.unlinkSync(path.join(__dirname, "..", task.attachment));
    }

    await task.destroy();

    logger.info(
      `Task deleted by user: ${req.user.id}, Task ID: ${req.params.id}`
    ); // لاگ اطلاعاتی

    return sendResponse(res, 200, "Task deleted");
  },

  getTask: async (req, res) => {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!task) return sendResponse(res, 404, "Task not found or unauthorized");

    logger.info(`Task retrieved by user: ${req.user.id}, Task ID: ${task.id}`); // لاگ اطلاعاتی

    return sendResponse(res, 200, "Task retrieved", task);
  },

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
    ); // لاگ اطلاعاتی

    return sendResponse(res, 200, "Tasks retrieved", {
      total: count,
      page,
      limit,
      data: rows,
    });
  },

  downloadTaskAttachment: async (req, res) => {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!task || !task.attachment)
      return sendResponse(res, 404, "Attachment not found");

    constස;

    const filePath = path.join(__dirname, "..", task.attachment);
    if (!fs.existsSync(filePath))
      return sendResponse(res, 404, "File not found");

    logger.info(
      `Task attachment downloaded by user: ${req.user.id}, Task ID: ${task.id}, File: ${task.attachment}`
    ); // لاگ اطلاعاتی

    res.download(filePath);
  },
};

module.exports = taskController;

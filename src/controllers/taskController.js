const Task = require('../models/taskModel');
const sendResponse = require('../utils/response');
const path = require('path');
const fs = require('fs');

const taskController = {
  createTask: async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;
    const attachment = req.file ? `uploads/${req.file.filename}` : null;

    const task = await Task.create({ name, description, attachment, user_id: userId });

    return sendResponse(res, 201, 'Task created', task);
  },

  updateTask: async (req, res) => {
    const { name, description } = req.body;
    const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!task) return sendResponse(res, 404, 'Task not found or unauthorized');

    let attachment = task.attachment;
    if (req.file) {
      if (task.attachment && fs.existsSync(path.join(__dirname, '..', task.attachment))) {
        fs.unlinkSync(path.join(__dirname, '..', task.attachment));
      }
      attachment = `uploads/${req.file.filename}`;
    }
    await task.update({ name, description, attachment });

    return sendResponse(res, 200, 'Task updated', task);
  },

  deleteTask: async (req, res) => {
    const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!task) return sendResponse(res, 404, 'Task not found or unauthorized');

    if (task.attachment && fs.existsSync(path.join(__dirname, '..', task.attachment))) {
      fs.unlinkSync(path.join(__dirname, '..', task.attachment));
    }

    await task.destroy();

    return sendResponse(res, 200, 'Task deleted');
  },

  getTask: async (req, res) => {
    const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!task) return sendResponse(res, 404, 'Task not found or unauthorized');

    return sendResponse(res, 200, 'Task retrieved', task);
  },

  getAllTasks: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;

    const { count, rows } = await Task.findAndCountAll({ where: { user_id: req.user.id }, limit, offset });
    return sendResponse(res, 200, 'Tasks retrieved', { total: count, page, limit, data: rows });
  },

  downloadTaskAttachment: async (req, res) => {
    const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!task || !task.attachment) return sendResponse(res, 404, 'Attachment not found');

    constස

    const filePath = path.join(__dirname, '..', task.attachment);
    if (!fs.existsSync(filePath)) return sendResponse(res, 404, 'File not found');

    res.download(filePath);
  },
};

module.exports = taskController;
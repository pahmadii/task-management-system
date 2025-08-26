const User = require("../models/userModel");
const sendResponse = require("../utils/response");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt"); 
const logger = require('../utils/logger');

const profileController = {
  updateProfile: async (req, res) => {
    const { email, phone } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return sendResponse(res, 404, "User not found");

    await user.update({ email, phone });

    logger.info(`Profile updated for user: ${user.username}, ID: ${user.id}`); // لاگ اطلاعاتی

    const { password, ...safeUser } = user.toJSON();
    return sendResponse(res, 200, "Profile updated", safeUser);
  },

  uploadProfileImage: async (req, res) => {
    const user = await User.findByPk(req.user.id);
    if (!user) return sendResponse(res, 404, "User not found");
    if (!req.file) return sendResponse(res, 400, "No file uploaded");

    if (!req.file.mimetype.startsWith('image/')) {
      return sendResponse(res, 400, 'Only image files are allowed for profile');
    }

    const filePath = `uploads/${req.file.filename}`;
    await user.update({ profile_image: filePath });

    logger.info(`Profile image uploaded for user: ${user.username}, ID: ${user.id}, File: ${filePath}`); // لاگ اطلاعاتی

    const { password, ...safeUser } = user.toJSON();
    safeUser.profile_image = filePath;

    return sendResponse(res, 200, "Profile image uploaded", safeUser);
  },

  downloadProfileImage: async (req, res) => {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.profile_image)
      return sendResponse(res, 404, "Profile image not found");

    const filePath = path.join(__dirname, "..", user.profile_image);
    if (!fs.existsSync(filePath)) return sendResponse(res, 404, "File not found");

    logger.info(`Profile image downloaded for user: ${user.username}, ID: ${user.id}, File: ${filePath}`); // لاگ اطلاعاتی

    res.download(filePath);
  },

  changePassword: async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return sendResponse(res, 404, "User not found");

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return sendResponse(res, 400, "Incorrect current password");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    logger.info(`Password changed for user: ${user.username}, ID: ${user.id}`); // لاگ اطلاعاتی

    return sendResponse(res, 200, "Password updated successfully");
  },
};

module.exports = profileController;
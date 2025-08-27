const User = require("../models/userModel");
const sendResponse = require("../utils/response");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");

const profileController = {
  //بروزرسانی پروفایل

  updateProfile: async (req, res) => {
    const { email, phone } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return sendResponse(res, 404, "User not found");

    await user.update({ email, phone });

    logger.info(`Profile updated for user: ${user.username}, ID: ${user.id}`);
    const { password, ...safeUser } = user.toJSON();
    return sendResponse(res, 200, "Profile updated", safeUser);
  },
  ////اپلود کردن تصویر

  uploadProfileImage: async (req, res) => {
    const user = await User.findByPk(req.user.id);
    if (!user) return sendResponse(res, 404, "User not found");
    if (!req.file) return sendResponse(res, 400, "No file uploaded");

    const relativeFilePath = path.join("uploads", req.file.filename);
    await user.update({ profile_image: relativeFilePath });

    logger.info(
      `Profile image uploaded for user: ${user.username}, ID: ${user.id}, File: ${relativeFilePath}`
    );

    const { password, ...safeUser } = user.toJSON();

    safeUser.profile_image = relativeFilePath;

    return sendResponse(res, 200, "Profile image uploaded", safeUser);
  },
  //دانلود تصویر

  downloadProfileImage: async (req, res) => {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.profile_image)
      return sendResponse(res, 404, "Profile image not found");

    const filePath = path.join(__dirname, "..", user.profile_image);

    if (!fs.existsSync(filePath))
      return sendResponse(res, 404, "File not found");

    logger.info(
      `Profile image downloaded for user: ${user.username}, ID: ${user.id}, File: ${filePath}`
    );

    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        logger.error(`Error downloading file: ${err.message}`);
        return sendResponse(res, 500, "Error downloading file");
      }
    });
  },

  // تغییر پسورد

  changePassword: async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return sendResponse(res, 404, "User not found");

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return sendResponse(res, 400, "Incorrect current password");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    logger.info(`Password changed for user: ${user.username}, ID: ${user.id}`);
    return sendResponse(res, 200, "Password updated successfully");
  },
};

module.exports = profileController;

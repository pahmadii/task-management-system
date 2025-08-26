const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const { Op } = require("sequelize");
const sendResponse = require("../utils/response");
const { ROLES } = require("../utils/constants");
const logger = require("../utils/logger");

const authController = {
  // ثبت‌نام کاربر
  register: async (req, res) => {
    const { username, email, phone, password } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }, { phone }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username)
        return sendResponse(res, 400, "Username already exists");
      if (existingUser.email === email)
        return sendResponse(res, 400, "Email already exists");
      if (existingUser.phone === phone)
        return sendResponse(res, 400, "Phone number already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
      role: ROLES.USER,
    });

    logger.info(`User registered: ${user.username}, ID: ${user.id}`); // لاگ اطلاعاتی

    return sendResponse(res, 201, "User registered successfully", {
      id: user.id,
      username,
      email,
      phone,
      role: user.role,
    });
  },
  // ورود کاربر
  login: async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) return sendResponse(res, 400, "User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendResponse(res, 400, "Incorrect password");

    const token = generateToken({ id: user.id, role: user.role });
    logger.info(`User logged in: ${user.username}, ID: ${user.id}`); // لاگ اطلاعاتی

    return sendResponse(res, 200, "Login successful", { token });
  },
};

module.exports = authController;

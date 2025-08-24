  const User = require("../models/userModel");
  const bcrypt = require("bcrypt");
  const generateToken = require("../utils/generateToken");
  const jwt = require("jsonwebtoken");
  const { Op } = require("sequelize");
  const sendResponse = require("../utils/response");

  const authController = {
    // ثبت‌نام کاربر
    register: async (req, res) => {
      try {
        const { username, email, phone, password } = req.body;

        // بررسی تکراری بودن username, email و phone
        
        const existingUser = await User.findOne({
          where: {
            [Op.or]: [{ username }, { email }, { phone }],
          },
        });

        if (existingUser) {
          if (existingUser.username === username)
            return res.status(400).json({ message: "Username already exists" });
          if (existingUser.email === email)
            return res.status(400).json({ message: "Email already exists" });
          if (existingUser.phone === phone)
            return res
              .status(400)
              .json({ message: "Phone number already exists" });
        }

        // هش کردن پسورد
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
          username,
          email,
          phone,
          password: hashedPassword,
        });
        return sendResponse(res, 201, "User registered successfully", {
          id: user.id,
          username,
          email,
          phone,
          role: user.role,
        });
      } catch (err) {
        throw err;
      }
    },

    // ورود کاربر
    login: async (req, res) => {
      try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) return sendResponse(res, 400, "User not found");

        const match = await bcrypt.compare(password, user.password);
        if (!match) return sendResponse(res, 400, "Incorrect password");

        // ساخت توکن JWT
        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return sendResponse(res, 200, "Login successful", { token });
      } catch (err) {
       throw err;
      }
    },
  };

  module.exports = authController;

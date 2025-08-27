const path = require("path");

module.exports = {
  ROLES: {
    USER: "user",
    ADMIN: "admin",
  },
  FILE_TYPES: ["image/jpeg", "image/png", "application/pdf"],
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  UPLOAD_DIR: path.join(__dirname, "..", "uploads"),
};

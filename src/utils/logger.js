const winston = require("winston");

const logger = winston.createLogger({
  level: "info", // پشتیبانی از لاگ‌های info و error
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // اضافه کردن زمان
    winston.format.json() // خروجی به فرمت JSON
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }), // لاگ خطاها
    new winston.transports.File({ filename: "combined.log", level: "info" }), // لاگ‌های info و error
  ],
});

// اگر در محیط development هستیم، لاگ‌ها رو در کنسول هم نمایش بده
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = logger;

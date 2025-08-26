const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { fileTypeFromFile } = require("file-type");
const { FILE_TYPES, MAX_FILE_SIZE,UPLOAD_DIR } = require("../utils/constants");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = async (req, file, cb) => {
  try {
    // ذخیره موقت فایل برای بررسی نوع

    const tempPath = path.join(
      __dirname,
      "..",
      "uploads",
      `temp-${Date.now()}${path.extname(file.originalname)}`
    );
    await new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(tempPath);
      file.stream.pipe(ws).on("finish", resolve).on("error", reject);
    });

    // بررسی نوع فایل با file-type

    const fileType = await fileTypeFromFile(tempPath);

    fs.unlinkSync(tempPath); // حذف فایل موقت

    if (fileType && FILE_TYPES.includes(fileType.mime)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and PDF files are allowed"), false);
    }
  } catch (err) {
    cb(new Error("Error validating file type"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

module.exports = upload;

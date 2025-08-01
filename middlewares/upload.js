// middleware/upload.js (ES-module version)
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔖 ➊ where files are kept - create specific directories
const uploadBaseDir = path.join(__dirname, "..", "uploads");

// Create uploads directory structure if it doesn't exist
const createUploadDirs = () => {
  const dirs = [
    path.join(uploadBaseDir, "certificates"),
    path.join(uploadBaseDir, "disaster-loans"),
    path.join(uploadBaseDir, "timber-permits"),
    path.join(uploadBaseDir, "vehicle-permits"),
    path.join(uploadBaseDir, "subsidies"), // Added subsidies directory
    path.join(uploadBaseDir, "general"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// 🔖 ➋ tell Multer how to store files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadBaseDir;

    // Determine upload path based on route or body parameter
    if (req.baseUrl && req.baseUrl.includes("certificates")) {
      uploadPath = path.join(uploadBaseDir, "certificates");
    } else if (req.baseUrl && req.baseUrl.includes("disaster-loans")) {
      uploadPath = path.join(uploadBaseDir, "disaster-loans");
    } else if (req.baseUrl && req.baseUrl.includes("timber-permits")) {
      uploadPath = path.join(uploadBaseDir, "timber-permits");
    } else if (req.baseUrl && req.baseUrl.includes("vehicle-permits")) {
      uploadPath = path.join(uploadBaseDir, "vehicle-permits");
    } else if (req.baseUrl && req.baseUrl.includes("subsidy")) {
      uploadPath = path.join(uploadBaseDir, "subsidies");
    } else {
      uploadPath = path.join(uploadBaseDir, "general");
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 🔖 Generate unique filename with user ID and timestamp
    const userId = req.user ? req.user._id : "anonymous";
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, `${userId}_${baseName}_${unique}${ext}`);
  },
});

// 🔖 ➌ File filter function for security
const fileFilter = (req, file, cb) => {
  // Allowed file types for subsidies and permits
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Only images (JPEG, JPG, PNG) and documents (PDF, DOC, DOCX) are allowed!"
      )
    );
  }
};

// 🔖 ➍ export ready-to-use middleware with configurations
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

// 🔖 ➎ Specific upload configurations for different services
export const certificateUpload = upload.single("proof");
export const disasterLoanUpload = upload.array("documents", 5); // Max 5 files
export const timberPermitUpload = upload.single("permitLetter");
export const vehiclePermitUpload = upload.array("documents", 10); // Max 10 files
export const subsidyUpload = upload.array("documents", 10); // Max 10 files for subsidies

// 🔖 ➏ General upload configurations
export const multipleUpload = upload.array("files", 10);
export const singleUpload = upload.single("file");

// 🔖 ➐ Default export for basic usage
export default upload;

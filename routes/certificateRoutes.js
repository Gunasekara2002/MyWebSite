import express from "express";
import {
  createCertificate,
  getAllCertificates,
  getCertificateById,
  getCertificatesByUser,
  updateCertificate,
  updateCertificateStatus,
  deleteCertificate,
  getCertificateStats,
  bulkUpdateCertificates,
  searchCertificates,
} from "../controllers/certificateController.js";
import { certificateUpload } from "../middlewares/upload.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Routes with file upload middleware
router.post("/", certificateUpload, createCertificate);
router.put("/:id", certificateUpload, updateCertificate);

// Search and stats routes
router.get("/search", searchCertificates);
router.get("/stats", getCertificateStats);

// Bulk operations
router.patch("/bulk-update", bulkUpdateCertificates);

// CRUD routes
router.get("/", getAllCertificates);
router.get("/user/:userId", getCertificatesByUser);
router.get("/:id", getCertificateById);
router.patch("/:id/status", updateCertificateStatus);
router.delete("/:id", deleteCertificate);

export default router;

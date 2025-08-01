import express from "express";
import {
  createSubsidyApplication,
  getUserApplications,
  getSubsidyApplication,
  updateSubsidyApplication,
  deleteSubsidyApplication,
  getAllApplications,
  reviewApplication,
  getApplicationStats,
  downloadFile,
  deleteDocument,
  UpdateStatus
} from "../controllers/subsidyController.js";
import protect from "../middlewares/authMiddleware.js";
import { multipleUpload } from "../middlewares/upload.js";


const router = express.Router();

// Admin routes (protected + admin role)
router.get("/admin/all", protect, getAllApplications);
router.get("/admin/stats", protect, getApplicationStats);
router.put("/admin/:id/review", protect, reviewApplication);
router.put("/admin/:id/status", protect, UpdateStatus); // <-- this one

// File management routes
router.get("/:applicationId/download/:documentIndex", protect, downloadFile);
router.delete(
  "/:applicationId/document/:documentIndex",
  protect,
  deleteDocument
);

// User routes (protected)
router.post("/", protect, multipleUpload, createSubsidyApplication);
router.get("/my-applications", protect, getUserApplications);
router.put("/:id", protect, multipleUpload, updateSubsidyApplication);
router.delete("/:id", protect, deleteSubsidyApplication);
router.get("/:id", protect, getSubsidyApplication); // <-- leave this LAST



export default router;

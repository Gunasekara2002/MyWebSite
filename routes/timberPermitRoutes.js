import express from "express";
import {
  createTimberPermit,
  getAllTimberPermits,
  getTimberPermitById,
  getTimberPermitsByUser,
  updateTimberPermit,
  updatePermitStatus,
  deleteTimberPermit,
  getPermitsByStatus,
  getPermitsByRoute,
  getExpiredPermits,
  getPermitsExpiringSoon,
} from "../controllers/timberPermitController.js";
import { timberPermitUpload } from "../middlewares/upload.js";
import protect from "../middlewares/authMiddleware.js";


const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Routes with file upload middleware
router.post("/", timberPermitUpload, createTimberPermit);
router.put("/:id", timberPermitUpload, updateTimberPermit);

// Public routes
router.get("/expired", getExpiredPermits);
router.get("/expiring-soon", getPermitsExpiringSoon);
router.get("/route/:route", getPermitsByRoute);

// Admin-only routes
router.get("/",  getAllTimberPermits);
router.get("/status/:status",  getPermitsByStatus);
router.patch("/:id/status",  updatePermitStatus);

// User-specific routes
router.get("/user/:userId", getTimberPermitsByUser);
router.get("/:id", getTimberPermitById);
router.delete("/:id", deleteTimberPermit);

export default router;

import express from "express";
import {
  createVehiclePermit,
  getAllVehiclePermits,
  getVehiclePermitById,
  getUserVehiclePermits,
  updateVehiclePermit,
  updatePermitStatus,
  updatePaymentStatus,
  deleteVehiclePermit,
  getPermitStatistics,
} from "../controllers/vehicalPermitController.js";
import { vehiclePermitUpload } from "../middlewares/upload.js";
import protect from "../middlewares/authMiddleware.js";


const router = express.Router();

// Public routes (no authentication required)
router.get("/:id", getVehiclePermitById);

// Protected routes (authentication required)
router.use(protect);

// User-specific routes
router.post("/", vehiclePermitUpload, createVehiclePermit);
router.get("/my-permits", getUserVehiclePermits);
router.put("/:id", vehiclePermitUpload, updateVehiclePermit);
router.delete("/:id", deleteVehiclePermit);

// Admin-only routes
router.get("/",  getAllVehiclePermits);
router.get("/admin/statistics",  getPermitStatistics);
router.put("/:id/status",  updatePermitStatus);

// Payment routes (can be accessed by user or admin)
router.put("/:id/payment", updatePaymentStatus);

export default router;

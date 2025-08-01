import express from "express";
import {
  createDisasterLoan,
  getAllDisasterLoans,
  getDisasterLoanById,
  getDisasterLoansByUser,
  updateDisasterLoan,
  updateLoanStatus,
  deleteDisasterLoan,
  getLoansByDisasterType,
  getLoansByStatus,
} from "../controllers/DisasterLoanController.js";
import { disasterLoanUpload } from "../middlewares/upload.js";
import protect from "../middlewares/authMiddleware.js";


const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Routes with file upload middleware
router.post("/", disasterLoanUpload, createDisasterLoan);
router.put("/:id", disasterLoanUpload, updateDisasterLoan);

// Public routes
router.get("/disaster-type/:disasterType", getLoansByDisasterType);

// Admin-only routes
router.get("/",  getAllDisasterLoans);
router.get("/status/:status", getLoansByStatus);
router.patch("/:id/status",  updateLoanStatus);

// User-specific routes
router.get("/user/:userId", getDisasterLoansByUser);
router.get("/:id", getDisasterLoanById);
router.delete("/:id", deleteDisasterLoan);

export default router;



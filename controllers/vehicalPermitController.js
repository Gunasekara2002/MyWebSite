import VehiclePermit from "../models/VehicalPermitModel.js";
import mongoose from "mongoose";
import fs from "fs/promises";

export const createVehiclePermit = async (req, res) => {
  try {
    // Validate file uploads
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one supporting document is required.",
      });
    }

    const {
      ownerName,
      nic,
      email,
      phone,
      address,
      vehicleNumber,
      vehicleType,
      vehicleModel,
      manufactureYear,
      engineNumber,
      chassisNumber,
      fuelType,
      permitType,
      purpose,
    } = req.body;

    // Check if vehicle already has a permit
    const existingPermit = await VehiclePermit.findOne({ vehicleNumber });
    if (existingPermit) {
      // Clean up uploaded files
      if (req.files) {
        for (const file of req.files) {
          await fs
            .unlink(file.path)
            .catch((err) => console.error("File cleanup failed:", err));
        }
      }
      return res.status(400).json({
        success: false,
        message: "Vehicle permit already exists for this vehicle number",
      });
    }

    const vehiclePermit = new VehiclePermit({
      user: req.user._id, // From protect middleware
      ownerName,
      nic,
      email,
      phone,
      address,
      vehicleNumber,
      vehicleType,
      vehicleModel,
      manufactureYear,
      engineNumber,
      chassisNumber,
      fuelType,
      permitType,
      purpose,
      documents: req.files.map((file) => file.path), // Array of file paths
    });

    await vehiclePermit.save();

    res.status(201).json({
      success: true,
      message: "Vehicle permit application submitted successfully",
      data: vehiclePermit,
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      for (const file of req.files) {
        await fs
          .unlink(file.path)
          .catch((err) => console.error("File cleanup failed:", err));
      }
    }
    console.error("Error creating vehicle permit:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all vehicle permits (with pagination and filtering)
export const getAllVehiclePermits = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      permitType,
      vehicleType,
      search,
    } = req.query;

    const query = {};

    // Add filters
    if (status) query.status = status;
    if (permitType) query.permitType = permitType;
    if (vehicleType) query.vehicleType = vehicleType;

    // Add search functionality
    if (search) {
      query.$or = [
        { ownerName: { $regex: search, $options: "i" } },
        { vehicleNumber: { $regex: search, $options: "i" } },
        { permitNumber: { $regex: search, $options: "i" } },
        { nic: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const permits = await VehiclePermit.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await VehiclePermit.countDocuments(query);

    res.status(200).json({
      success: true,
      data: permits,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("Error fetching vehicle permits:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get vehicle permit by ID
export const getVehiclePermitById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid permit ID",
      });
    }

    const permit = await VehiclePermit.findById(id).populate(
      "user",
      "name email"
    );

    if (!permit) {
      return res.status(404).json({
        success: false,
        message: "Vehicle permit not found",
      });
    }

    res.status(200).json({
      success: true,
      data: permit,
    });
  } catch (error) {
    console.error("Error fetching vehicle permit:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get user's vehicle permits
export const getUserVehiclePermits = async (req, res) => {
  try {
    const userId = req.user._id; // Changed from req.user.id to req.user._id for consistency
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const permits = await VehiclePermit.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await VehiclePermit.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      data: permits,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("Error fetching user vehicle permits:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update vehicle permit (for users - limited fields)
export const updateVehiclePermit = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Changed from req.user.id to req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid permit ID",
      });
    }

    const permit = await VehiclePermit.findById(id);

    if (!permit) {
      return res.status(404).json({
        success: false,
        message: "Vehicle permit not found",
      });
    }

    // Check if user owns this permit
    if (permit.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Only allow updates if status is pending or rejected
    if (permit.status !== "pending" && permit.status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Cannot update permit in current status",
      });
    }

    // Fields that users can update
    const allowedUpdates = ["ownerName", "email", "phone", "address"];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Handle file uploads if present
    if (req.files && req.files.length > 0) {
      // Clean up old files
      if (permit.documents && permit.documents.length > 0) {
        for (const docPath of permit.documents) {
          await fs
            .unlink(docPath)
            .catch((err) => console.error("File cleanup failed:", err));
        }
      }
      updates.documents = req.files.map((file) => file.path);
    }

    // Reset status to pending if it was rejected
    if (permit.status === "rejected") {
      updates.status = "pending";
      updates.officerNotes = "";
    }

    const updatedPermit = await VehiclePermit.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Vehicle permit updated successfully",
      data: updatedPermit,
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      for (const file of req.files) {
        await fs
          .unlink(file.path)
          .catch((err) => console.error("File cleanup failed:", err));
      }
    }
    console.error("Error updating vehicle permit:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update permit status (for officers/admin)
export const updatePermitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, officerNotes, feeAmount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid permit ID",
      });
    }

    const validStatuses = ["pending", "approved", "rejected", "under_review"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updates = { status };
    if (officerNotes !== undefined) updates.officerNotes = officerNotes;
    if (feeAmount !== undefined) updates.feeAmount = feeAmount;

    const updatedPermit = await VehiclePermit.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPermit) {
      return res.status(404).json({
        success: false,
        message: "Vehicle permit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Permit status updated successfully",
      data: updatedPermit,
    });
  } catch (error) {
    console.error("Error updating permit status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid permit ID",
      });
    }

    const validPaymentStatuses = ["pending", "paid", "failed"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const permit = await VehiclePermit.findById(id);
    if (!permit) {
      return res.status(404).json({
        success: false,
        message: "Vehicle permit not found",
      });
    }

    // Check if user owns this permit or is admin
    const userId = req.user._id;
    const isOwner = permit.user.toString() === userId.toString();
    const isAdmin = req.user.role === "admin" || req.user.isAdmin; // Adjust based on your user model

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const updatedPermit = await VehiclePermit.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: updatedPermit,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete vehicle permit
export const deleteVehiclePermit = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Changed from req.user.id to req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid permit ID",
      });
    }

    const permit = await VehiclePermit.findById(id);

    if (!permit) {
      return res.status(404).json({
        success: false,
        message: "Vehicle permit not found",
      });
    }

    // Check if user owns this permit
    if (permit.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Only allow deletion if status is pending or rejected
    if (permit.status !== "pending" && permit.status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete permit in current status",
      });
    }

    // Clean up associated files
    if (permit.documents && permit.documents.length > 0) {
      for (const docPath of permit.documents) {
        await fs
          .unlink(docPath)
          .catch((err) => console.error("File cleanup failed:", err));
      }
    }

    await VehiclePermit.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Vehicle permit deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vehicle permit:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get permit statistics (for dashboard)
export const getPermitStatistics = async (req, res) => {
  try {
    const stats = await VehiclePermit.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const vehicleTypeStats = await VehiclePermit.aggregate([
      {
        $group: {
          _id: "$vehicleType",
          count: { $sum: 1 },
        },
      },
    ]);

    const permitTypeStats = await VehiclePermit.aggregate([
      {
        $group: {
          _id: "$permitType",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalPermits = await VehiclePermit.countDocuments();
    const totalRevenue = await VehiclePermit.aggregate([
      {
        $match: { paymentStatus: "paid" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$feeAmount" },
        },
      },
    ]);

    // Recent permits (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPermits = await VehiclePermit.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      success: true,
      data: {
        statusStats: stats,
        vehicleTypeStats,
        permitTypeStats,
        totalPermits,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentPermits,
      },
    });
  } catch (error) {
    console.error("Error fetching permit statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

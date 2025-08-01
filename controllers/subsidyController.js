import Subsidy from "../models/subsidyModel.js";
import User from "../models/User.js";
import { sendSubsidyStatusEmail } from "../utils/email.js";
import fs from "fs";
import path from "path";

export const createSubsidyApplication = async (req, res) => {
  try {
    const { type, data } = req.body;

    // Validate required fields
    if (!type || !data) {
      return res.status(400).json({
        message: "Subsidy type and data are required",
      });
    }

    // Check if user already has a pending application of the same type
    const existingApplication = await Subsidy.findOne({
      user: req.user._id,
      type,
      status: { $in: ["pending", "under_review"] },
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You already have a pending application for this subsidy type",
      });
    }

    // Parse data if it's a string (when files are uploaded, form data comes as strings)
    let parsedData;
    try {
      parsedData = typeof data === "string" ? JSON.parse(data) : data;
    } catch (error) {
      return res.status(400).json({
        message: "Invalid data format",
      });
    }

    // Handle uploaded files
    const uploadedDocuments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        uploadedDocuments.push({
          fieldName: file.fieldname,
          fileName: file.originalname,
          filePath: file.path,
          uploadDate: new Date(),
        });
      });
    }

    // Add uploaded documents to data
    if (uploadedDocuments.length > 0) {
      parsedData.uploadedDocuments = uploadedDocuments;
    }

    // Create new subsidy application
    const subsidy = new Subsidy({
      user: req.user._id,
      type,
      data: parsedData,
      status: "pending",
    });

    const savedSubsidy = await subsidy.save();
    await savedSubsidy.populate("user", "name email");

    // Send application submission confirmation email
    try {
      await sendSubsidyStatusEmail({
        to: savedSubsidy.user.email,
        name: savedSubsidy.user.name,
        applicationId: savedSubsidy._id.toString(),
        subsidyType: savedSubsidy.type,
        status: savedSubsidy.status,
        reviewDate: null,
        rejectionReason: null,
        adminNotes:
          "Your application has been successfully submitted and is now pending review.",
      });
      console.log(
        `Application submission email sent to ${savedSubsidy.user.email}`
      );
    } catch (emailError) {
      console.error("Error sending application submission email:", emailError);
    }

    res.status(201).json({
      message: "Subsidy application submitted successfully",
      subsidy: savedSubsidy,
    });
  } catch (error) {
    console.error("Error creating subsidy application:", error);

    // Clean up uploaded files if application creation fails
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const applications = await Subsidy.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("reviewedBy", "name");

    const total = await Subsidy.countDocuments({ user: req.user._id });

    res.json({
      applications,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getSubsidyApplication = async (req, res) => {
  try {
    const subsidy = await Subsidy.findById(req.params.id)
      .populate("user", "name email")
      .populate("reviewedBy", "name email");

    if (!subsidy) {
      return res.status(404).json({ message: "Subsidy application not found" });
    }

    // Check if user owns this application or is admin
    if (
      subsidy.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(subsidy);
  } catch (error) {
    console.error("Error fetching subsidy application:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateSubsidyApplication = async (req, res) => {
  try {
    const subsidy = await Subsidy.findById(req.params.id);

    if (!subsidy) {
      return res.status(404).json({ message: "Subsidy application not found" });
    }

    // Check ownership
    if (subsidy.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only allow updates if status is pending
    if (subsidy.status !== "pending") {
      return res.status(400).json({
        message: "Cannot update application that is not in pending status",
      });
    }

    const { data } = req.body;

    // Parse data if it's a string
    let parsedData;
    try {
      parsedData = typeof data === "string" ? JSON.parse(data) : data;
    } catch (error) {
      return res.status(400).json({
        message: "Invalid data format",
      });
    }

    // Handle new uploaded files
    const newUploadedDocuments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        newUploadedDocuments.push({
          fieldName: file.fieldname,
          fileName: file.originalname,
          filePath: file.path,
          uploadDate: new Date(),
        });
      });
    }

    // Merge existing and new documents
    const existingDocuments = subsidy.data.uploadedDocuments || [];
    const allDocuments = [...existingDocuments, ...newUploadedDocuments];

    // Update subsidy data
    subsidy.data = {
      ...subsidy.data,
      ...parsedData,
      uploadedDocuments: allDocuments,
    };

    const updatedSubsidy = await subsidy.save();
    await updatedSubsidy.populate("user", "name email");

    res.json({
      message: "Application updated successfully",
      subsidy: updatedSubsidy,
    });
  } catch (error) {
    console.error("Error updating subsidy application:", error);

    // Clean up uploaded files if update fails
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteSubsidyApplication = async (req, res) => {
  try {
    const subsidy = await Subsidy.findById(req.params.id);

    if (!subsidy) {
      return res.status(404).json({ message: "Subsidy application not found" });
    }

    // Check ownership
    if (subsidy.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only allow deletion if status is pending
    if (subsidy.status !== "pending") {
      return res.status(400).json({
        message: "Cannot delete application that is not in pending status",
      });
    }

    // Delete associated files
    if (
      subsidy.data.uploadedDocuments &&
      subsidy.data.uploadedDocuments.length > 0
    ) {
      subsidy.data.uploadedDocuments.forEach((doc) => {
        if (fs.existsSync(doc.filePath)) {
          fs.unlinkSync(doc.filePath);
        }
      });
    }

    await Subsidy.findByIdAndDelete(req.params.id);

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting subsidy application:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const type = req.query.type;

    // Build query
    let query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const applications = await Subsidy.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .populate("reviewedBy", "name");

    const total = await Subsidy.countDocuments(query);

    res.json({
      applications,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching all applications:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const reviewApplication = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { status, adminNotes, rejectionReason } = req.body;

    if (!["approved", "rejected", "under_review"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be approved, rejected, or under_review",
      });
    }

    const subsidy = await Subsidy.findById(req.params.id);

    if (!subsidy) {
      return res.status(404).json({ message: "Subsidy application not found" });
    }

    // Store old status for comparison
    const oldStatus = subsidy.status;

    subsidy.status = status;
    subsidy.reviewDate = new Date();
    subsidy.reviewedBy = req.user._id;

    if (adminNotes) subsidy.adminNotes = adminNotes;
    if (status === "rejected" && rejectionReason) {
      subsidy.rejectionReason = rejectionReason;
    }

    const updatedSubsidy = await subsidy.save();
    await updatedSubsidy.populate([
      { path: "user", select: "name email" },
      { path: "reviewedBy", select: "name email" },
    ]);

    // Send email notification if status changed
    if (oldStatus !== status) {
      try {
        await sendSubsidyStatusEmail({
          to: updatedSubsidy.user.email,
          name: updatedSubsidy.user.name,
          applicationId: updatedSubsidy._id.toString(),
          subsidyType: updatedSubsidy.type,
          status: status,
          reviewDate: updatedSubsidy.reviewDate,
          rejectionReason: updatedSubsidy.rejectionReason,
          adminNotes: updatedSubsidy.adminNotes,
        });
        console.log(
          `Status update email sent to ${updatedSubsidy.user.email} for application ${req.params.id}`
        );
      } catch (emailError) {
        console.error("Error sending status update email:", emailError);
      }
    }

    res.json({
      message: `Application ${status} successfully`,
      subsidy: updatedSubsidy,
    });
  } catch (error) {
    console.error("Error reviewing application:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getApplicationStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const stats = await Subsidy.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const typeStats = await Subsidy.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalApplications = await Subsidy.countDocuments();

    res.json({
      totalApplications,
      statusStats: stats,
      typeStats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// New endpoint to download uploaded files
export const downloadFile = async (req, res) => {
  try {
    const { applicationId, documentIndex } = req.params;

    const subsidy = await Subsidy.findById(applicationId);

    if (!subsidy) {
      return res.status(404).json({ message: "Subsidy application not found" });
    }

    // Check if user owns this application or is admin
    if (
      subsidy.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const documents = subsidy.data.uploadedDocuments;
    if (!documents || !documents[documentIndex]) {
      return res.status(404).json({ message: "Document not found" });
    }

    const document = documents[documentIndex];
    const filePath = document.filePath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // Set appropriate headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.fileName}"`
    );
    res.setHeader("Content-Type", "application/octet-stream");

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// New endpoint to delete specific uploaded documents
export const deleteDocument = async (req, res) => {
  try {
    const { applicationId, documentIndex } = req.params;

    const subsidy = await Subsidy.findById(applicationId);

    if (!subsidy) {
      return res.status(404).json({ message: "Subsidy application not found" });
    }

    // Check ownership
    if (subsidy.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only allow deletion if status is pending
    if (subsidy.status !== "pending") {
      return res.status(400).json({
        message:
          "Cannot delete documents from application that is not in pending status",
      });
    }

    const documents = subsidy.data.uploadedDocuments;
    if (!documents || !documents[documentIndex]) {
      return res.status(404).json({ message: "Document not found" });
    }

    const document = documents[documentIndex];

    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Remove document from array
    subsidy.data.uploadedDocuments.splice(documentIndex, 1);

    await subsidy.save();

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Fixed and enhanced status update function
export const UpdateStatus = async (req, res) => {
  try {
    // Change from applicationId to id to match the route parameter
    const { id } = req.params;
    const { status, adminNotes, rejectionReason } = req.body;

    // Find subsidy and populate user data for email
    const subsidy = await Subsidy.findById(id).populate(
      "user",
      "name email"
    );

    if (!subsidy) {
      return res.status(404).json({ message: "Subsidy application not found" });
    }

    // Check ownership or admin permission
    const isOwner = subsidy.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Store old status for comparison
    const oldStatus = subsidy.status;

    // Update subsidy fields
    subsidy.status = status;
    subsidy.reviewDate = new Date();

    // Only set reviewedBy if user is admin
    if (isAdmin) {
      subsidy.reviewedBy = req.user._id;
    }

    if (adminNotes) {
      subsidy.adminNotes = adminNotes;
    }

    if (status === "rejected" && rejectionReason) {
      subsidy.rejectionReason = rejectionReason;
    }

    await subsidy.save();

    // Send email notification if status actually changed
    if (oldStatus !== status) {
      try {
        await sendSubsidyStatusEmail({
          to: subsidy.user.email,
          name: subsidy.user.name,
          applicationId: subsidy._id.toString(),
          subsidyType: subsidy.type,
          status: status,
          reviewDate: subsidy.reviewDate,
          rejectionReason: subsidy.rejectionReason,
          adminNotes: subsidy.adminNotes,
        });
        console.log(
          `Status update email sent to ${subsidy.user.email} for application ${id}`
        );
      } catch (emailError) {
        console.error("Error sending status update email:", emailError);
        // Don't fail the status update if email fails
      }
    }

    res.json({
      message: "Status updated successfully",
      subsidy: {
        id: subsidy._id,
        status: subsidy.status,
        reviewDate: subsidy.reviewDate,
        emailSent: oldStatus !== status,
      },
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
import mongoose from "mongoose"; // Added missing import
import Certificate from "../models/certificateModel.js";
import User from "../models/User.js";

export const createCertificate = async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Proof document is required.",
      });
    }

    const {
      type,
      fullName,
      address,
      copies,
      // Birth certificate fields
      personName,
      sex,
      dob,
      place,
      division,
      entryNo,
      entryDate,
      fatherName,
      motherName,
      // Marriage certificate fields
      marriageType,
      maleName,
      femaleName,
      registrarName,
      officeLocation,
      regDivision,
      placeSolemnized,
      dateOfMarriage,
      // Death certificate fields
      deceasedName,
      dateOfDeath,
      placeOfDeath,
      causeOfDeath,
      solemnizedPlace,
    } = req.body;

    // Validate certificate type specific fields
    let certificateData = {
      user: req.user._id, // From protect middleware
      type,
      fullName,
      address,
      copies: parseInt(copies), // Ensure number
      proof: req.file.path, // From certificateUpload
    };

    switch (type) {
      case "birth":
        if (!personName || !sex || !dob || !place) {
          return res.status(400).json({
            success: false,
            message: "Required birth certificate fields are missing",
          });
        }
        certificateData = {
          ...certificateData,
          personName,
          sex,
          dob,
          place,
          division,
          entryNo,
          entryDate,
          fatherName,
          motherName,
        };
        break;

      case "marriage":
        if (!maleName || !femaleName || !dateOfMarriage) {
          return res.status(400).json({
            success: false,
            message: "Required marriage certificate fields are missing",
          });
        }
        certificateData = {
          ...certificateData,
          marriageType,
          maleName,
          femaleName,
          registrarName,
          officeLocation,
          regDivision,
          placeSolemnized,
          dateOfMarriage,
        };
        break;

      case "death":
        if (!deceasedName || !dateOfDeath || !placeOfDeath) {
          return res.status(400).json({
            success: false,
            message: "Required death certificate fields are missing",
          });
        }
        certificateData = {
          ...certificateData,
          deceasedName,
          dateOfDeath,
          placeOfDeath,
          causeOfDeath,
          solemnizedPlace,
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid certificate type",
        });
    }

    const certificate = new Certificate(certificateData);
    await certificate.save();

    // Populate user data before sending response
    await certificate.populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      data: certificate,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all certificates with filtering and pagination
export const getAllCertificates = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      user,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (user) filter.user = user;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const certificates = await Certificate.find(filter)
      .populate("user", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const totalCertificates = await Certificate.countDocuments(filter);
    const totalPages = Math.ceil(totalCertificates / parseInt(limit));

    res.status(200).json({
      success: true,
      data: certificates,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCertificates,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching certificates",
      error: error.message,
    });
  }
};

// Get certificate by ID
export const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate ID",
      });
    }

    const certificate = await Certificate.findById(id).populate(
      "user",
      "name email"
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching certificate",
      error: error.message,
    });
  }
};

// Get certificates by user ID
export const getCertificatesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, type, status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Build filter object
    const filter = { user: userId };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const certificates = await Certificate.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCertificates = await Certificate.countDocuments(filter);
    const totalPages = Math.ceil(totalCertificates / parseInt(limit));

    res.status(200).json({
      success: true,
      data: certificates,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCertificates,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user certificates",
      error: error.message,
    });
  }
};

// Update certificate
export const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate ID",
      });
    }

    // Handle file update if new file uploaded
    if (req.file) {
      updateData.proof = req.file.path;
    }

    // Remove immutable fields from update data
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.user; // Prevent user change

    const certificate = await Certificate.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("user", "name email");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating certificate",
      error: error.message,
    });
  }
};

// Update certificate status
export const updateCertificateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate ID",
      });
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const certificate = await Certificate.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Certificate ${status} successfully`,
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating certificate status",
      error: error.message,
    });
  }
};

// Delete certificate
export const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate ID",
      });
    }

    const certificate = await Certificate.findByIdAndDelete(id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting certificate",
      error: error.message,
    });
  }
};

// Get certificate statistics
export const getCertificateStats = async (req, res) => {
  try {
    const { userId } = req.query;

    let matchStage = {};
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      matchStage.user = new mongoose.Types.ObjectId(userId);
    }

    const stats = await Certificate.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalCertificates: { $sum: 1 },
          pendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          birthCount: {
            $sum: { $cond: [{ $eq: ["$type", "birth"] }, 1, 0] },
          },
          marriageCount: {
            $sum: { $cond: [{ $eq: ["$type", "marriage"] }, 1, 0] },
          },
          deathCount: {
            $sum: { $cond: [{ $eq: ["$type", "death"] }, 1, 0] },
          },
          totalCopies: { $sum: "$copies" },
        },
      },
    ]);

    const result = stats[0] || {
      totalCertificates: 0,
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      birthCount: 0,
      marriageCount: 0,
      deathCount: 0,
      totalCopies: 0,
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching certificate statistics",
      error: error.message,
    });
  }
};

// Bulk update certificates
export const bulkUpdateCertificates = async (req, res) => {
  try {
    const { certificateIds, updateData } = req.body;

    if (!Array.isArray(certificateIds) || certificateIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Certificate IDs array is required",
      });
    }

    // Validate all IDs
    const invalidIds = certificateIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate IDs found",
        invalidIds,
      });
    }

    // Remove immutable fields
    const cleanUpdateData = { ...updateData };
    delete cleanUpdateData._id;
    delete cleanUpdateData.createdAt;
    delete cleanUpdateData.user;

    const result = await Certificate.updateMany(
      { _id: { $in: certificateIds } },
      cleanUpdateData,
      { runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Certificates updated successfully",
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating certificates",
      error: error.message,
    });
  }
};

// Search certificates
export const searchCertificates = async (req, res) => {
  try {
    const {
      q,
      type,
      status,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Build search filter
    const searchFilter = {
      $or: [
        { fullName: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } },
        { personName: { $regex: q, $options: "i" } },
        { maleName: { $regex: q, $options: "i" } },
        { femaleName: { $regex: q, $options: "i" } },
        { deceasedName: { $regex: q, $options: "i" } },
        { fatherName: { $regex: q, $options: "i" } },
        { motherName: { $regex: q, $options: "i" } },
      ],
    };

    // Add additional filters
    if (type) searchFilter.type = type;
    if (status) searchFilter.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const certificates = await Certificate.find(searchFilter)
      .populate("user", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const totalResults = await Certificate.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalResults / parseInt(limit));

    res.status(200).json({
      success: true,
      data: certificates,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalResults,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching certificates",
      error: error.message,
    });
  }
};

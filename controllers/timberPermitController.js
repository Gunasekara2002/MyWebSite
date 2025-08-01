// controllers/timberPermitController.js
import TimberPermit from "../models/TimberPermitModel.js";

export const createTimberPermit = async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Permit request letter is required.",
      });
    }

    // Prepare data with user and file path
    const data = {
      ...req.body,
      user: req.user._id, // From protect middleware
      permitLetter: req.file.path, // File path from timberPermitUpload
    };

    const timberPermit = new TimberPermit(data);
    const savedPermit = await timberPermit.save();
    res.status(201).json({
      success: true,
      data: savedPermit,
      message: "Timber permit application created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// Get all timber permit applications
export const getAllTimberPermits = async (req, res) => {
  try {
    const permits = await TimberPermit.find().populate("user", "name email");
    res.status(200).json({
      success: true,
      data: permits,
      count: permits.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get timber permit by ID
export const getTimberPermitById = async (req, res) => {
  try {
    const permit = await TimberPermit.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!permit) {
      return res.status(404).json({
        success: false,
        message: "Timber permit application not found",
      });
    }
    res.status(200).json({
      success: true,
      data: permit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get timber permits by user ID
export const getTimberPermitsByUser = async (req, res) => {
  try {
    const permits = await TimberPermit.find({
      user: req.params.userId,
    }).populate("user", "name email");
    res.status(200).json({
      success: true,
      data: permits,
      count: permits.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update timber permit application
export const updateTimberPermit = async (req, res) => {
  try {
    const permit = await TimberPermit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!permit) {
      return res.status(404).json({
        success: false,
        message: "Timber permit application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: permit,
      message: "Timber permit application updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update permit status and handle approval details
export const updatePermitStatus = async (req, res) => {
  try {
    const { status, permitNumber, expiryDate, officerNotes } = req.body;

    const updateData = {
      status,
      officerNotes: officerNotes || "",
    };

    // If approving, set issued date and permit details
    if (status === "approved") {
      updateData.issuedDate = new Date();
      updateData.permitNumber = permitNumber || "";
      updateData.expiryDate = expiryDate ? new Date(expiryDate) : null;
    }

    const permit = await TimberPermit.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!permit) {
      return res.status(404).json({
        success: false,
        message: "Timber permit application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: permit,
      message: `Permit application ${status} successfully`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete timber permit application
export const deleteTimberPermit = async (req, res) => {
  try {
    const permit = await TimberPermit.findByIdAndDelete(req.params.id);
    if (!permit) {
      return res.status(404).json({
        success: false,
        message: "Timber permit application not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Timber permit application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get permits by status
export const getPermitsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const permits = await TimberPermit.find({ status }).populate(
      "user",
      "name email"
    );
    res.status(200).json({
      success: true,
      data: permits,
      count: permits.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get permits by route
export const getPermitsByRoute = async (req, res) => {
  try {
    const { route } = req.params;
    const permits = await TimberPermit.find({
      route: { $regex: route, $options: "i" },
    }).populate("user", "name email");
    res.status(200).json({
      success: true,
      data: permits,
      count: permits.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get expired permits
export const getExpiredPermits = async (req, res) => {
  try {
    const currentDate = new Date();
    const permits = await TimberPermit.find({
      status: "approved",
      expiryDate: { $lt: currentDate },
    }).populate("user", "name email");
    res.status(200).json({
      success: true,
      data: permits,
      count: permits.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get permits expiring soon (within next 30 days)
export const getPermitsExpiringSoon = async (req, res) => {
  try {
    const currentDate = new Date();
    const thirtyDaysFromNow = new Date(
      currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    const permits = await TimberPermit.find({
      status: "approved",
      expiryDate: {
        $gte: currentDate,
        $lte: thirtyDaysFromNow,
      },
    }).populate("user", "name email");

    res.status(200).json({
      success: true,
      data: permits,
      count: permits.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

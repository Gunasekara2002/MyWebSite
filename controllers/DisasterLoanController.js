import DisasterLoan from "../models/DisasterLoanModel.js";

// Create a new disaster loan application
export const createDisasterLoan = async (req, res) => {
  try {
    const data = {
      ...req.body,
      user: req.user._id, // Add user ID from middleware
      documents: req.files ? req.files.map((file) => file.path) : [], // Handle uploaded files
    };
    const disasterLoan = new DisasterLoan(data);
    const savedLoan = await disasterLoan.save();
    res.status(201).json({
      success: true,
      data: savedLoan,
      message: "Disaster loan application created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// Get all disaster loan applications
export const getAllDisasterLoans = async (req, res) => {
  try {
    const loans = await DisasterLoan.find().populate("user", "name email");
    res.status(200).json({
      success: true,
      data: loans,
      count: loans.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get disaster loan by ID
export const getDisasterLoanById = async (req, res) => {
  try {
    const loan = await DisasterLoan.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Disaster loan application not found",
      });
    }
    res.status(200).json({
      success: true,
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get disaster loans by user ID
export const getDisasterLoansByUser = async (req, res) => {
  try {
    const loans = await DisasterLoan.find({ user: req.params.userId }).populate(
      "user",
      "name email"
    );
    res.status(200).json({
      success: true,
      data: loans,
      count: loans.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update disaster loan application
export const updateDisasterLoan = async (req, res) => {
  try {
    const loan = await DisasterLoan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("user", "name email");

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Disaster loan application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: loan,
      message: "Disaster loan application updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update loan status (approve/reject)
export const updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const loan = await DisasterLoan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Disaster loan application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: loan,
      message: `Loan application ${status} successfully`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete disaster loan application
export const deleteDisasterLoan = async (req, res) => {
  try {
    const loan = await DisasterLoan.findByIdAndDelete(req.params.id);
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Disaster loan application not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Disaster loan application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get loans by disaster type
export const getLoansByDisasterType = async (req, res) => {
  try {
    const { disasterType } = req.params;
    const loans = await DisasterLoan.find({ disasterType }).populate(
      "user",
      "name email"
    );
    res.status(200).json({
      success: true,
      data: loans,
      count: loans.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get loans by status
export const getLoansByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const loans = await DisasterLoan.find({ status }).populate(
      "user",
      "name email"
    );
    res.status(200).json({
      success: true,
      data: loans,
      count: loans.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



import mongoose from "mongoose";

const VehiclePermitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Owner Information
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  nic: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },

  // Vehicle Information
  vehicleNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ["Motor Car", "Motorcycle", "Three Wheeler", "Bus", "Lorry", "Other"],
    trim: true,
  },
  vehicleModel: {
    type: String,
    required: true,
    trim: true,
  },
  manufactureYear: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1,
  },
  engineNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  chassisNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  fuelType: {
    type: String,
    required: true,
    enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    trim: true,
  },

  // Permit Information
  permitType: {
    type: String,
    required: true,
    enum: ["New Registration", "Renewal", "Transfer"],
    trim: true,
  },
  purpose: {
    type: String,
    required: true,
    enum: ["Private", "Commercial", "Government", "Tourism"],
    trim: true,
  },

  // Documents
  documents: [
    {
      type: String, // URLs to uploaded files
      required: true,
    },
  ],

  // Status Tracking
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "under_review"],
    default: "pending",
  },
  permitNumber: {
    type: String,
    default: "",
    trim: true,
  },
  issueDate: {
    type: Date,
    default: null,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  feeAmount: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  officerNotes: {
    type: String,
    default: "",
    trim: true,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
VehiclePermitSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Auto-generate permit number when status changes to approved
VehiclePermitSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "approved" &&
    !this.permitNumber
  ) {
    const prefix = this.vehicleType === "Motorcycle" ? "MC" : "VP";
    this.permitNumber = `${prefix}-${Date.now().toString().slice(-6)}`;
    this.issueDate = new Date();
    this.expiryDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    );
  }
  next();
});

export default mongoose.model("VehiclePermit", VehiclePermitSchema);

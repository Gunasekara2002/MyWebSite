import mongoose from "mongoose";

const DisasterLoanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  loanAmount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  disasterType: {
    type: String,
    enum: ["flood", "drought", "landslide", "cyclone", "fire", "other"],
    required: true,
  },
  damageDetails: {
    type: String,
    required: true,
  },
  employmentStatus: {
    type: String,
    required: true,
  },
  documents: [
    {
      type: String, 
    },
  ],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("DisasterLoan", DisasterLoanSchema);


import mongoose from "mongoose";

const TimberPermitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  route: {
    type: String,
    required: true,
    trim: true,
  },
  timberDetails: {
    type: String,
    required: true,
    trim: true,
  },
  permitLetter: {
    type: String, // URL to the uploaded file
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  issuedDate: {
    type: Date,
    default: null,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  permitNumber: {
    type: String,
    default: "",
  },
  officerNotes: {
    type: String,
    default: "",
    trim: true,
  },
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
TimberPermitSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("TimberPermit", TimberPermitSchema);

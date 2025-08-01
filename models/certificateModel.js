import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["birth", "marriage", "death"],
    required: true,
  },
  // Common fields
  fullName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  copies: {
    type: Number,
    required: true,
    min: 1,
  },
  proof: {
    type: String, // URL to uploaded file
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  // Birth certificate specific fields
  personName: String,
  sex: String,
  dob: Date,
  place: String,
  division: String,
  entryNo: String,
  entryDate: Date,
  fatherName: String,
  motherName: String,
  // Marriage certificate specific fields
  marriageType: String,
  maleName: String,
  femaleName: String,
  registrarName: String,
  officeLocation: String,
  regDivision: String,
  placeSolemnized: String,
  dateOfMarriage: Date,
  // Death certificate specific fields
  deceasedName: String,
  dateOfDeath: Date,
  placeOfDeath: String,
  causeOfDeath: String,
  solemnizedPlace: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Certificate", certificateSchema);

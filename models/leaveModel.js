// server/models/leaveModel.js
import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  employeeName: String,
  position: String,
  year: Number,
  vacationLeave: Number,
  casualLeave: Number,
  otherLeave: Number,
  totalTaken: Number,
  carryOver: Number,
}, { timestamps: true });

export default mongoose.models.Leave || mongoose.model('Leave', leaveSchema);

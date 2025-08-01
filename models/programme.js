import mongoose from 'mongoose';

const programmeSchema = new mongoose.Schema({
  employeeName: String,
  position: String,
  projectTitle: String,
  description: String,
  date: String,
  duration: String,
  outcome: String,
}, { timestamps: true });

export default mongoose.model('Programme', programmeSchema);

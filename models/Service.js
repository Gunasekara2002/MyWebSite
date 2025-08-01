import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    enum: ['disaster-loan', 'timber-permit', 'official-certificate', 'vehicle-revenue-permit'],
    required: true,
  },
  formData: { type: mongoose.Schema.Types.Mixed, required: true },
  files: [{ filename: String, url: String }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);

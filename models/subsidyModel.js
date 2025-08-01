import mongoose from 'mongoose';

const subsidySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      '① Elderly Allowance',
      '② Disability Allowance', 
      '③ Housing Assistance',
      '④ Nutrition Allowance'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  reviewDate: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  data: {
    // Common fields
    fullName: String,
    dateOfBirth: Date,
    gender: String,
    nationalIdNumber: String,
    address: String,
    contactNumber: String,
    
    // Elderly Allowance specific
    maritalStatus: String,
    receivingPensionOrAid: String,
    dependents: String,
    
    // Disability Allowance specific
    typeOfDisability: String,
    disabilityDuration: String,
    employmentStatus: String,
    receivingOtherDisabilityBenefit: String,
    
    // Housing Assistance specific
    ownershipStatus: String,
    monthlyHouseholdIncome: Number,
    numberOfFamilyMembers: Number,
    typeOfAssistanceRequested: String,
    housingConditionDescription: String,
    
    // Nutrition Allowance specific
    age: Number,
    numberOfChildren: Number,
    healthConditions: String,
    receivingOtherFoodAssistance: String,
    
    // File uploads (store file paths or URLs)
    uploadedDocuments: [{
      fieldName: String,
      fileName: String,
      filePath: String,
      uploadDate: { type: Date, default: Date.now }
    }]
  },
  adminNotes: String,
  rejectionReason: String
}, {
  timestamps: true
});

// Index for efficient queries
subsidySchema.index({ user: 1, type: 1 });
subsidySchema.index({ status: 1 });
subsidySchema.index({ applicationDate: -1 });

const Subsidy = mongoose.model('Subsidy', subsidySchema);

export default Subsidy;


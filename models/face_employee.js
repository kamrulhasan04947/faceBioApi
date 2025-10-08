const mongoose = require("mongoose");
const EmployeeMaster = require("./employee"); // EmployeeMaster is defined in employee.js

const faceEmployeeSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'EmployeeMaster',
    unique: true,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  facImage: {
    type: String,
    trim: true,
    default: null,
  },
  createdAt: { 
    type: Date,
    default: Date.now,
  },
  updatedAt: {    
    type: Date,
    default: Date.now,
  },
}, 
{  timestamps: true, }
); 


faceEmployeeSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isModified('employreeId') || this.isModified('facImage')) {
    this.updatedAt = Date.now();
  }
  next();
});


const FaceEmployee = mongoose.model("FaceEmployee", faceEmployeeSchema);
module.exports = FaceEmployee;


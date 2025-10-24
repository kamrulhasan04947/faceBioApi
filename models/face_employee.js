const mongoose = require("mongoose");
const Employee = require("./employee"); // EmployeeMaster is defined in employee.js

const faceEmployeeSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee',
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

  facLogs: [
    {
      location:{
        type: {
          type: String,
          enum: ['Point'], // GeoJSON type
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0], // Default coordinates
        },
      },

      faceTimestamp:{
        type: Date,
        required: true,
        default: Date.now,
      },
    }
  ],
  
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
  if (this.isModified('name') || this.isModified('employeeId') || this.isModified('facImage')) {
    this.updatedAt = Date.now();
  }
  next();
});


const FaceEmployee = mongoose.model("FaceEmployee", faceEmployeeSchema);
module.exports = FaceEmployee;
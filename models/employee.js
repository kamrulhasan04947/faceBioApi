const mongoose = require("mongoose");
const employeeMasterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  token: {
    type: String,
    unique: true,
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
});

employeeMasterSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isModified("employreeId")) { 
    this.updatedAt = Date.now();
  } 
  next();
});




const EmployeeMaster = mongoose.model("EmployeeMaster", employeeMasterSchema);  
module.exports = EmployeeMaster;
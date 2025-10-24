const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
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
  password:{
    type: String,
    required: true,
    minlength:4,
    trim:true,
  },
  token: {
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

employeeSchema.pre('save', async function (next){
  const employee = this;
  if (employee.isModified("name") || employee.isModified("employeeId") || employee.isModified('password')) { 
    employee.password = await bcrypt.hash(employee.password, 8);
    employee.updatedAt = Date.now();
  } 
  next();
});


employeeSchema.methods.generateAuthToken = async function (){
  const employee = this;
  const token = jwt.sign({ _id: employee._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
  employee.token = token;
  await employee.save();
  return token;
};


employeeSchema.statics.findByCredentials = async (employeeId, password) => {
  const employee = await Employee.findOne({ employeeId});

  if (!employee) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, employee.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return employee;
}; 

const Employee = mongoose.model("Employee", employeeSchema);  
module.exports = Employee;
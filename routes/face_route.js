const express = require('express');
const router = express.Router();
const faceEmployee = require('../models/face_employee'); // Assuming face_employee.js is in models directory
const Employee = require('../models/employee'); // Assuming employee.js is in models directory
const multer = require('multer');
const path = require('path');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
  }
});

const upload = multer({ storage: storage });


router.post('/face_employees/register-face', upload.single('faceImage'), async (req, res) => {
  try {
    const {employeeId} = req.body;
    const faceImage = req.file ? req.file.path : null;
    if (!employeeId) {
      return res.status(400).json({ message: 'employreeId and faceImage are required' });
    }
    // Check if employee with the same employreeId already exists
    const existingEmployee = await faceEmployee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(409).json({ message: 'Employee with this employeeId already exists' });
    }
    const activeEmployee = await Employee.findOne({ employeeId: employeeId});
    if (activeEmployee) {
      const newFaceEmployee = new faceEmployee({
        employee: activeEmployee._id, // Reference to the EmployeeMaster document
        employeeId: activeEmployee.employeeId, // Use the employeeId from EmployeeMaster
        facImage: faceImage,
      });
      await newFaceEmployee.save();
      res.status(201).json({ 
        message: `Face Employee with employeeId ${newFaceEmployee.employeeId} created successfully`, 
        data: newFaceEmployee 
      });
      
    }else { 
      return res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error creating face employee:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  } 
});

router.get('/face_employees/faces', async (req, res) => {
  try {
    const faceEmployees = await faceEmployee.find().populate('employee'); // Populate the employee details
    res.status(200).json(faceEmployees);
  } catch (error) {
    console.error('Error fetching face employees:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.get('/face_employees/faces/:id', async (req, res) => {
  try {
    const faceEmployeeId = req.params.id;
    const faceEmployeeData = await faceEmployee.findById(faceEmployeeId).populate('employee'); // Populate the employee details
    if (!faceEmployeeData) {
      return res.status(404).json({ message: 'Face Employee not found' });
    }
    res.status(200).json(faceEmployeeData);
  } catch (error) {
    console.error('Error fetching face employee:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.put('/face_employees/faces/:id', upload.single('faceImage'), async (req, res) => {
  try {
    const faceEmployeeId = req.params.id;
    const { employeeId } = req.body;
    const faceImage = req.file ? req.file.path : null;

    const faceEmployeeData = await faceEmployee.findById(faceEmployeeId);
    if (!faceEmployeeData) {
      return res.status(404).json({ message: 'Face Employee not found' });
    }

    // Update fields if provided
    if (employeeId) faceEmployeeData.employeeId = employeeId;
    if (faceImage) faceEmployeeData.facImage = faceImage;

    await faceEmployeeData.save();
    res.status(200).json({ message: 'Face Employee updated successfully', data: faceEmployeeData });
  } catch (error) {
    console.error('Error updating face employee:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



router.delete('/face_employees/faces/:id', async (req, res) => {
  try {
    const faceEmployeeId = req.params.id;
    const faceEmployeeData = await faceEmployee.findByIdAndDelete(faceEmployeeId);
    if (!faceEmployeeData) {
      return res.status(404).json({ message: 'Face Employee not found' });
    }
    res.status(200).json({ message: 'Face Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting face employee:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
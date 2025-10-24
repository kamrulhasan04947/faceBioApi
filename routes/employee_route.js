const express = require('express');
const router = express.Router();
const Employee = require('../models/employee'); // Assuming employee.js is in models directory

router.post('/employees/register', async (req, res) => {
  const { name, employeeId, password} = req.body;
  try {
    const isExist = await Employee.findOne({employeeId})
    if(isExist){
      res.status(409).json({
        message: "Employee is allrady exist"
      })
    }
    const newEmployee = new Employee({
      name,
      employeeId,
      password
    });
    await newEmployee.save();
    res.status(200).json({
      message: `Employee ${newEmployee.employeeId} created successfully`, 
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  } 
});

router.post('/employees/verify', async (req, res)=>{
  const {employeeId, password} = req.body;
  try{
    const employee = await Employee.findByCredentials(employeeId, password)
    if(!employee){
      res.status(404).json({
        isActive: false,
        message: "Not found! employee is not active",
      })
    }
    token = await employee.generateAuthToken();

    res.status(200).json({
      isActive:true,
      message: `${employee.name} is active`,
      token: token,
      employee: employee.employeeId
    })
  }catch (e){
    res.status(500).json({
      message: "Internal Server error",
      error: e.message
    });
  }
});


router.post('/employees/update/:employeeId', async (req, res)=>{ 
  const {employeeId} = req.params;
  const updates = req.body;
  try{
    const employee = await Employee.findOneAndUpdate({employeeId}, updates, {new: true});
    if(!employee){
      return res.status(404).json({message: "Employee not found"});
    }
    res.status(200).json({
      message: "Employee updated successfully",
      employee
    });
  }catch (e){
    res.status(500).json({
      message: "Internal Server error",
      error: e.message
    });
  }
});


router.delete('/employees/delete/:employeeId', async (req, res)=>{
  const {employeeId} = req.params;
  try{
    const employee = await Employee.findOneAndDelete({employeeId});
    if(!employee){
      return res.status(404).json({message: "Employee not found"});
    }
    res.status(200).json({
      message: `Employee ${employeeId} deleted successfully`,
    });
  }catch (e){
    res.status(500).json({
      message: "Internal Server error",
      error: e.message
    });
  }
});

router.get('/employees/:employeeId', async (req, res)=>{
  const {employeeId} = req.params;
  try{
    const employee = await Employee.findOne({employeeId});
    if(!employee){
      return res.status(404).json({message: "Employee not found"});
    }
    res.status(200).json({
      employee
    });
  }catch (e){
    res.status(500).json({
      message: "Internal Server error",
      error: e.message
    });
  }
});


router.get('/employees', async (req, res)=>{
  try{
    const employees = await Employee.find({});
    res.status(200).json({
      employees
    });
  }catch (e){
    res.status(500).json({
      message: "Internal Server error",
      error: e.message
    });
  }
});


module.exports = router;
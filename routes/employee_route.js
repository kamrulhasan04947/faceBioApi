const express = require('express');
const router = express.Router();
const Employee = require('../models/employee'); // Assuming employee.js is in models directory

router.post('/employees/register', async (req, res) => {
  try {
    const { name, employeeId} = req.body;
    const newEmployee = new Employee({
      name,
      employeeId,
    });
    await newEmployee.save();
    res.status(200).json({
        message: `Employee ${newEmployee.name} ${newEmployee.employeeId} created successfully`, 
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  } 
});

router.post('/employees/verify', async(req, res)=>{
  try{
   const {employeeId} = req.body;
   if(!employeeId){
      res.status(404).json({message: 'No id found'});
   }
   activeEmployee = await Employee.findOne({employeeId})
   if(activeEmployee){
     res.status(200).json({
       isActive: true,
       message: "Employee is active"
     })
   }else{
     res.status(404).json({
      isActive: false,
      message: "Employee is not active",
     });
   }
  }catch(error){
    console.error('Error verifying employee:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
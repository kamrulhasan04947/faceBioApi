const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance_employee');



router.post('/attendance/register', async (req, res) => {
  try {
    const {employeeId, empployeeName, location, faceTimestamp} = req.body;
    if (!employeeId || !location || !faceTimestamp || !empployeeName) {
      return res.status(400).json({ message: 'employeeId, attendanceDate, and status are required' });
    }
    const newAttendance = new Attendance({
      employeeId,
      empployeeName,
      faceLogs:{
        location,
        faceTimestamp: faceTimestamp || Date.now(),
      }
    });
    await newAttendance.save();

    res.status(200).json({ 
      message: `Attendance for employeeId ${newAttendance.employeeId} created successfully`, 
      data: newAttendance 
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} );

router.get('/attendance/all', async(req, res)=>{
  try{
    const record = await Attendance.find.populate("employeeId");
    if(!record){
      res.status(400).json({message: 'emaployee null?!'});
    
    }

    res.status(200).json({
      message: "Success",
      data:record
    });
  }catch(error){
    res.status(500).json({
      message: error.message,
      data: {message: "data not found"}
    })
  }
})


router.get("/attendance/byid/:id", async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id).populate("employeeId");
    if (!record) return res.status(404).json({ message: "Not found" });
    res.status(200).json({
      message: "Success",
      data: record
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("attendance/update/:id", async (req, res) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("employeeId");

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.delete("attendance/delete/:id", async (req, res) => {
  try {
    const deleted = await Attendance.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router




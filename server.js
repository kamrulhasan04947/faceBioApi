const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

require('dotenv').config();

const employeeRoute = require('./routes/employee_route');
const faceRoute = require('./routes/face_route');
const attendanceRoute = require('./routes/attendance_route');



require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "*",  // allow all origins (for testing)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err)); 



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(employeeRoute);
app.use(faceRoute);
app.use(attendanceRoute);



app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
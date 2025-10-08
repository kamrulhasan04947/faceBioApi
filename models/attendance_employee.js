const { default: mongoose } = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    empployeeName: {
        type: String,
        required: true,
        trim: true,
    },
    
    faceLogs: [{
        location: {
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
        faceTimestamp: {
        type: Date,
        required: true,
        default: Date.now,
        },
    }],
    
});


attendanceSchema.index({ location: '2dsphere' }); // Create a 2dsphere index for geospatial queries
const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;

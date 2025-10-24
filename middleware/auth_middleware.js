const jwt = require('jsonwebtoken');
const Employee = require('../models/employee')

// Auth Middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');// Get token from headers
        const decoded = jwt.verify(token, process.env.JWT_SECRET);         // Verify the token
        const employee = await Employee.findOne({ _id: decoded._id, 'token': token });

        if (!employee) {
            res.status(404).send({message: "employee not found"});
        }
        
        req.token = token;
        req.employee = employee;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;
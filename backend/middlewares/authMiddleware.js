const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    // Check if header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Check if token is provided in headers
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
}
const User = require('../models/User');
const jwt = require('jsonwebtoken');


// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
}

// Register user
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    // validation: check for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registring user', error: error.message });
    }
}

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // validation: check for missing fields
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            _id: user._id,
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
}

// Get user info
exports.getUserInfo = async (req, res) => {
    const userId = req.user._id; // Assuming user ID is set in req.user by a middleware

    try {
        const user = await User.findById(userId).select('-password'); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user info', error: error.message });
    }
}
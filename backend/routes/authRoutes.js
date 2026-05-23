const express = require('express');
const { protect } = require('../middlewares/authMiddleware');

const { registerUser, loginUser, getUserInfo } = require('../controllers/authController');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

// Route for user registration
router.post('/register', registerUser);
// Route for user login
router.post('/login', loginUser);
// Route for getting user profile
router.get('/getUser', protect, getUserInfo);

// Route for getting user profile by ID
router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    // Build URL using the same protocol as the request (http or https)
    const protocol = req.protocol;
    const host = req.get("host");
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(200).json({ imageUrl });
});



module.exports = router;
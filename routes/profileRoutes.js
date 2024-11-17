const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const authMiddleware = require('./authMiddleware');



// Set up Multer Storage
const storage = multer.memoryStorage(); // Store images in memory
const upload = multer({ storage: storage }).single('profile_image'); // Expecting the file to come in as 'profile_image'

// 1. Profile Route - Get user's profile details
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            profile_image: user.profile_image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 2. Password Route - Change user's password
router.post('/profile/password', authMiddleware, async (req, res) => {
    try {
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            return res.status(400).json({ message: 'Current and new passwords are required' });
        }

        const user = await User.findById(req.user.user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(current_password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
        user.password_hash = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 3. Manage Profile Route - Update profile image
// Route to handle profile image update
router.post('/profile/manageProfile', authMiddleware, upload, async (req, res) => {
    try {
        // Check if the image was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Profile image is required' });
        }

        // Retrieve the user from the database
        const user = await User.findById(req.user.user_id);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Convert the uploaded image into a buffer and save it to the user's profile_image field
        user.profile_image = req.file.buffer; // Store image buffer directly in the DB

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Profile image changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 4. Logout Route - Unassign JWT token
router.post('/profile/logout', (req, res) => {
    try {
        res.header("Authorization", "");
        res.status(200).json({ message: 'You logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

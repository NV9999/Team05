const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('./authMiddleware');

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
router.post('/profile/manageProfile', authMiddleware, async (req, res) => {
    try {
        const { profile_image } = req.body;

        if (!profile_image) {
            return res.status(400).json({ message: 'Profile image is required' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profile_image = profile_image;
        await user.save();

        res.status(200).json({ message: 'Profile image changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 4. Logout Route - Unassign JWT token
router.post('/profile/logout', (req, res) => {
    try {
        // Clear the token by setting an empty cookie
        res.cookie('token', '', { 
            httpOnly: true,  // Ensure cookie is accessible only by the server
            secure: true,    // Ensure cookie is sent only over HTTPS
            sameSite: 'Strict', // Prevent CSRF by restricting the cookie to same-site requests
            expires: new Date(0) // Expire the cookie immediately
        });
        res.status(200).json({ message: 'You logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

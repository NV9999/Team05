const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');  // Adjust the path to your models folder
const router = express.Router();

// Secret key for JWT (in production, store this securely)
const JWT_SECRET = 'your_jwt_secret_key'; // Use a secure key in production

// Configure nodemailer for sending verification emails
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Adjust the email service accordingly
    auth: {
        user: 'your_email@example.com', // Your email
        pass: 'your_email_password' // Your email password or app-specific password
    }
});

// User signup route - Step 1: Email, password, confirm password, and send verification code
router.post('/signup', async (req, res) => {
    try {
        const { email, password, confirm_password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate password match
        if (password !== confirm_password) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate a verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit verification code

        // Create new user with the hashed password and verification code
        const newUser = new User({
            email,
            password_hash: hashedPassword,
            verification_code: verificationCode, // Store the verification code
            created_at: Date.now(),
            updated_at: Date.now()
        });

        // Send verification email
        const mailOptions = {
            from: 'your_email@example.com',
            to: email,
            subject: 'Verification Code',
            text: `Your verification code is: ${verificationCode}`
        };

        await transporter.sendMail(mailOptions);

        // Save user and send response
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully. Check your email for the verification code.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Verify code route - Step 2: User submits the verification code
router.post('/verify', async (req, res) => {
    try {
        const { email, verification_code } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user || user.verification_code !== verification_code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // Update the user's verification status
        user.verification_status = true;
        user.verification_code = undefined; // Clear the verification code
        await user.save();

        res.json({ message: 'Email verified successfully. Please complete your registration.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Complete registration route - Step 3: User provides additional details (first_name, last_name, etc.)
router.post('/complete-registration', async (req, res) => {
    try {
        const { email, first_name, last_name, phone_number, unit_number } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user || !user.verification_status) {
            return res.status(400).json({ message: 'User not verified or not found' });
        }

        // Update user details
        user.first_name = first_name;
        user.last_name = last_name;
        user.phone_number = phone_number;
        user.unit_number = unit_number;
        user.updated_at = Date.now(); // Update timestamp

        await user.save();
        res.json({ message: 'Registration completed successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});



module.exports = router;

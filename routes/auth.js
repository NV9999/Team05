const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Verification = require('../models/Verification');
const authMiddleware = require('./authMiddleware');

const router = express.Router();

const JWT_SECRET = 'pragnesh-BAAPU';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'notoriousgamingpubg@gmail.com',
        pass: 'byqc gavt nwlr ajmx'
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // const salt = await bcrypt.genSalt(10);
       // const hashedPassword = await bcrypt.hash(password, salt);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const verificationUser = new Verification({
            user_id: uuidv4(),
            email,
            verificationCode
        });

        await verificationUser.save();

        // const newUser = new User({
        //     user_id: uuidv4(),
        //     email,
        //     password_hash: hashedPassword,
        //     verification_code: verificationCode,
        // });

        const mailOptions = {
            from: 'notoriousgamingpubg@gmail.com',
            to: email,
            subject: 'Verification Code',
            text: `Your verification code is: ${verificationCode}`
        };

        await transporter.sendMail(mailOptions);
        // await newUser.save();
        res.status(201).json({ message: 'verification code has been sent sucessfully. Check your email for the verification code.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/verify', async (req, res) => {
    try {
        const { email, password, verification_code } = req.body;
        const verifyUser = await Verification.findOne({ email });
        if (!verifyUser || verifyUser.verificationCode !== verification_code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
       // user.verification_status = true;
         verifyUser.verificationCode = undefined;
         const newUser = new User({
            user_id: uuidv4(),
            email,
            password_hash: hashedPassword,
            //verification_code: verificationCode,
            verification_status : true,
        });
        await newUser.save();
        res.json({ message: 'Email verified successfully. Please complete your registration.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/complete-registration', async (req, res) => {
    try {
        const { email, first_name, last_name, phone_number, unit_number } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.verification_status) {
            return res.status(400).json({ 
                status: 400, 
                message: 'User not verified or not found' 
            });
        }

        user.first_name = first_name;
        user.last_name = last_name;
        user.phone_number = phone_number;
        user.unit_number = unit_number;
        user.updated_at = Date.now();

        if (user.first_name && user.last_name && user.phone_number && user.unit_number !== null) {
            user.isUserRegistered = true;
        }

        await user.save();

        res.json({
            status: 200,
            message: 'Registration completed successfully!',
            isUserRegistered: user.isUserRegistered
        });
    } catch (err) {
        res.status(500).json({ 
            status: 500, 
            message: 'Server error', 
            error: err.message 
        });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verification_code = verificationCode;
        await user.save();

        const mailOptions = {
            from: 'notoriousgamingpubg@gmail.com',
            to: email,
            subject: 'Password Reset Verification Code',
            text: `Your password reset verification code is: ${verificationCode}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Verification code sent to your email.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/verify-password-code', async (req, res) => {
    try {
        const { email, verification_code } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.verification_code !== verification_code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }
        res.status(200).json({ message: 'Verification code is correct. You may now reset your password.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, new_password} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
         // Check if the new password is the same as the old one
         const isSamePassword = await bcrypt.compare(new_password, user.password_hash);
         if (isSamePassword) {
             return res.status(400).json({ message: 'New password must be different from the old password' });
         }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
        user.password_hash = hashedPassword;
        user.verification_code = undefined;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ user_id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;

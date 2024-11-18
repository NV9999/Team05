const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin'); 
const router = express.Router();

const SECRET_KEY = 'Juhi-Medam'; 

// Admin login route
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the admin in the database
        const admin = await Admin.findOne({ email: username });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin.admin_id}, SECRET_KEY, { expiresIn: '1d' });

        // Set the token in cookies
        res.cookie('token', token, { httpOnly: true, secure: true });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.post('/admin/forgot-password', async (req, res) => {
    const { username, newPassword } = req.body;

    try {
        // Find the admin by username
        const admin = await Admin.findOne({ email: username });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in the database
        admin.password_hash = hashedPassword;
        await admin.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;
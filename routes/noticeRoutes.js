const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');  // Adjust path to your models folder
const authMiddleware = require('./authMiddleware');  // Middleware to authenticate users


// Route to fetch all notices for a user
router.get('/notices', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.user_id; // Retrieve the logged-in user's ID

        // Find all notices for the user
        const notices = await Notice.find({ user_id: userId });

        if (notices.length === 0) {
            return res.status(200).json({ message: 'No notices available.', notices: [] });
        }

        // Respond with the full notice objects
        res.status(200).json({ notices });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



// Route to fetch details of a particular notice
router.get('/notices/:noticeId', authMiddleware, async (req, res) => {
    try {
        const { noticeId } = req.params;
        const userId = req.user.user_id; // Retrieve the logged-in user's ID

        // Find the specific notice by ID for the user
        const notice = await Notice.findOne({ notice_id: noticeId, user_id: userId });

        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        // Respond with the full notice object
        res.status(200).json({ notice });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



module.exports = router;
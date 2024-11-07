const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('./authMiddleware');

// Route to get all past complaints for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const complaints = await Complaint.find({ user_id: userId });

        if (complaints.length === 0) {
            return res.status(200).json({ message: 'No complaints found', complaints: [] });
        }

        res.status(200).json({ message: 'Complaints retrieved successfully', complaints });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Route to get complaint details
router.get('/:complaintId', authMiddleware, async (req, res) => {
    try {
        const { complaintId } = req.params;
        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.status(200).json({ message: 'Complaint details retrieved successfully', complaint });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Route to add a new complaint
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { complaint_type, title, description } = req.body;
        const userId = req.user.user_id;

        // Validate required fields
        if (!complaint_type || !title || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Generate unique complaint ID and number
        const complaintId = uuidv4();
        const complaintNumber = `${Math.floor(1000 + Math.random() * 9000)}`;

        const newComplaint = new Complaint({
            complaint_id: complaintId,
            user_id: userId,
            complaint_type,
            title,
            description,
            complaint_number: complaintNumber,
            status: 'pending',
            submission_date: Date.now()  // Adding submission date
        });

        await newComplaint.save();

        res.status(201).json({
            message: 'Complaint Submitted',
            details: 'Your complaint has been submitted to the admin. You will be notified about the actions. Once resolved, you can provide feedback.'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Route to submit feedback for resolved complaint
router.post('/:complaintId/feedback', authMiddleware, async (req, res) => {
    try {
        const { complaintId } = req.params;
        const { feedback } = req.body;

        // Ensure feedback is provided
        if (!feedback) {
            return res.status(400).json({ message: 'Feedback is required' });
        }

        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (complaint.status !== 'resolved') {
            return res.status(403).json({ message: 'Feedback can only be submitted for resolved complaints' });
        }

        complaint.feedback = feedback;
        await complaint.save();

        res.status(200).json({ message: 'Feedback sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Route to delete a pending complaint
router.delete('/:complaintId', authMiddleware, async (req, res) => {
    try {
        const { complaintId } = req.params;

        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (complaint.status !== 'pending') {
            return res.status(403).json({ message: 'Only pending complaints can be deleted' });
        }

        await complaint.remove();
        res.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const HallBooking = require('../../models/HallBooking');
const User = require('../../models/User');

// Middleware for admin authentication (JWT, optional)
const adminMiddleware = require('../adminRoutes/adminMiddleware/adminMiddleware');

// 1. Get all hall bookings
router.get('/halls', adminMiddleware, async (req, res) => {
    try {
        const hallBookings = await HallBooking.find()
            .populate('user_id', 'first_name last_name unit_number') // Populate user details
            .select('-__v'); // Exclude version field

        res.status(200).json(hallBookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hall bookings' });
    }
});

// 2. Get details of a particular hall booking
router.get('/halls/:id', adminMiddleware, async (req, res) => {
    try {
        const hallBooking = await HallBooking.findById(req.params.id)
            .populate('user_id', 'first_name last_name unit_number')
            .select('-__v');

        if (!hallBooking) {
            return res.status(404).json({ error: 'Hall booking not found' });
        }

        res.status(200).json(hallBooking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hall booking details' });
    }
});

// Approve a booking
router.put('/halls/:id/approve', adminMiddleware, async (req, res) => {
    const { comments } = req.body; // Admin comments for approval

    try {
        const hallBooking = await HallBooking.findById(req.params.id);

        if (!hallBooking) {
            return res.status(404).json({ error: 'Hall booking not found' });
        }

        if (hallBooking.status !== 'pending') {
            return res.status(400).json({ error: 'Only pending bookings can be approved' });
        }

        hallBooking.status = 'approved';
        hallBooking.approvalReason = comments;

        await hallBooking.save();

        res.status(200).json({ message: 'Booking approved successfully', hallBooking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve booking' });
    }
});

// Reject a booking
router.put('/halls/:id/reject', adminMiddleware, async (req, res) => {
    const { comments } = req.body; // Admin comments for rejection

    try {
        const hallBooking = await HallBooking.findById(req.params.id);

        if (!hallBooking) {
            return res.status(404).json({ error: 'Hall booking not found' });
        }

        if (hallBooking.status !== 'pending') {
            return res.status(400).json({ error: 'Only pending bookings can be rejected' });
        }

        hallBooking.status = 'rejected';
        hallBooking.rejectionReason = comments;

        await hallBooking.save();

        res.status(200).json({ message: 'Booking rejected successfully', hallBooking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject booking' });
    }
});

module.exports = router;

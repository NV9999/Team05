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

// 3. Approve or Reject a booking
router.put('/halls/:id/status', adminMiddleware, async (req, res) => {
    const { status, comments } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const hallBooking = await HallBooking.findById(req.params.id);

        if (!hallBooking) {
            return res.status(404).json({ error: 'Hall booking not found' });
        }

        if (status === 'approved') {
            hallBooking.status = 'approved';
            hallBooking.approvalReason = comments;
        } else if (status === 'rejected') {
            hallBooking.status = 'rejected';
            hallBooking.rejectionReason = comments;
        }

        await hallBooking.save();

        res.status(200).json({ message: `Booking ${status} successfully`, hallBooking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});

module.exports = router;

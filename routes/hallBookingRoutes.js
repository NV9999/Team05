const express = require('express');
const router = express.Router();
const HallBooking = require('../models/HallBooking');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Middleware to authenticate user (if needed)
const authMiddleware = require('./authMiddleware');

// Route to get all past hall bookings for a user
router.get('/bookings', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.user_id; // Assume req.user is set from the auth middleware
        const bookings = await HallBooking.find({ user_id: userId });

        if (bookings.length === 0) {
            return res.status(200).json({ message: 'No bookings found', bookings: [] });
        }

        res.status(200).json({ message: 'Bookings retrieved successfully', bookings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Route to get hall booking details
router.get('/bookings/details/:bookingId', authMiddleware, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await HallBooking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        let response = {
            booking_id: booking.booking_id,
            user_id: booking.user_id,
            hallName: booking.hallName,
            startingTime: booking.booking_startingTime,
            endingTime: booking.booking_endingTime,
            bookingTime: booking.submission_date,
            status: booking.status,
            hallNumber: booking.hallNumber
        };

        if (booking.hallName === 'Insight Hall') {
            response.amenities = booking.InsightHallAmenities;
        } else if (booking.hallName === 'Decennial Hall') {
            response.amenities = booking.DecennialHallAmenities;
        }

        if (booking.status === 'rejected') {
            response.rejectionReason = booking.RejectionReason;
        }

        res.status(200).json({ message: 'Booking details retrieved successfully', booking: response });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Route to delete a hall booking
router.delete('/bookings/delete/:bookingId', authMiddleware, async (req, res) => {
    try {
        const { bookingId } = req.params;
       // const booking = await HallBooking.findByIdAndDelete(bookingId);
       const booking = await HallBooking.findByIdAndDelete(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Route to request a new hall booking
router.post('/bookings/request', authMiddleware, async (req, res) => {
    try {
        const { hallName, booking_startingTime, booking_endingTime } = req.body;
        const userId = req.user.user_id; // Assume req.user is set from the auth middleware

        // Validate input
        if (!hallName || !booking_startingTime || !booking_endingTime) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Generate unique IDs
        const bookingId = uuidv4();
        const hallNumber = `${Math.floor(1000 + Math.random() * 9000)}`;
        const submissionDate = new Date();

        // Create a new hall booking
        const newBooking = new HallBooking({
            booking_id: bookingId,
            user_id: userId,
            booking_startingTime,
            booking_endingTime,
            submission_date: submissionDate,
            hallNumber,
            hallName,
            status: 'pending'
        });

        // Save the booking and send response
        await newBooking.save();
        res.status(201).json({
            message: 'Successful request submitted to admin. Wait for confirmation.',
            hallNumber,
            submittedDate: submissionDate
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

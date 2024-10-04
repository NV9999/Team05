const mongoose = require('mongoose');

const HallBookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingDate: { type: Date, required: true },
    eventDate: { type: Date, required: true },
    purpose: { type: String, required: true },
    status: { type: String, enum: ['booked', 'cancelled', 'completed'], default: 'booked' }
}, { timestamps: true });

module.exports = mongoose.model('HallBooking', HallBookingSchema);

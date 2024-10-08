const mongoose = require('mongoose');

const HallBookingSchema = new mongoose.Schema({
    booking_id: { type: String, required: true, unique: true },  // Unique identifier for the booking
    tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Foreign key reference to User model (tenant)
    booking_date: { type: Date, required: true },  // Date the hall is booked for
    submission_date: { type: Date, required: true },  // Date the booking request was submitted
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected', 'cancelled'], 
        default: 'pending'  // Status of the booking
    },
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Admin/manager approving the booking
    created_at: { type: Date, default: Date.now },  // Timestamp when the booking was created
    updated_at: { type: Date, default: Date.now }  // Timestamp when the booking was last updated
}, { timestamps: true });

module.exports = mongoose.model('HallBooking', HallBookingSchema);

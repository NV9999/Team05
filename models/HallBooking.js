const mongoose = require('mongoose');

const HallBookingSchema = new mongoose.Schema({
    booking_id: { type: String, required: true, unique: true },  // Unique identifier for the booking
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Foreign key reference to User model (tenant)
    booking_startingTime: { type: Date, required: true },  // Date and time of the start of the booking
    booking_endingTime: { type: Date, required: true },  // Date and time of the end of the booking
    submission_date: { type: Date, required: true },  // Date and time the booking request was submitted
    hallNumber: { type: String, required: true, unique: true },  // Unique small hall number
    hallName: { type: String, required: true },  // Name of the hall being booked
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending'  // Status of the booking
    },
    RejectionReason: { type: String },  // Reason for rejection, if status is 'rejected'
    approvalReason: { type: String }, // Reason for approval, if status is 'approved'
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },  // Admin/manager approving the booking
    InsightHallAmenities: {  // Amenities specific to Insight Hall
        type: [String],
        default: [
            'Open-concept and suite-style rooms',
            'Cardio lounge',
            'Movie lounge',
            'Games room',
            'Kitchen lounge with BBQ patio',
            '24-hour front desk',
            'Housekeeping services'
        ]
    },
    DecennialHallAmenities: {  // Amenities specific to Decennial Hall
        type: [String],
        default: [
            'Single and shared suite-style rooms',
            'Study lounges',
            'Fitness center',
            'Community kitchen',
            'Recreation areas',
            'Laundry facilities',
            'Mental health support'
        ]
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('HallBooking', HallBookingSchema);

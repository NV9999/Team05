const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    appointment_id: { type: String, required: true, unique: true },  // Unique identifier for the appointment
    guest_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Foreign key reference to User model (guest or tenant)
    appointment_date: { type: Date, required: true },  // Date and time of the appointment
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Admin or manager hosting the appointment
    status: { 
        type: String, 
        enum: ['scheduled', 'completed', 'cancelled'], 
        default: 'scheduled'  // Current status of the appointment
    },
    created_at: { type: Date, default: Date.now },  // Timestamp when the appointment was created
    updated_at: { type: Date, default: Date.now }  // Timestamp when the appointment was last updated
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);

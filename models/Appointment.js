const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    appointment_id: { type: String, required: true, unique: true },  // Unique identifier for the appointment
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Foreign key reference to User model (tenant)
    visitor_id: { type: mongoose.Schema.Types.ObjectId, ref:'VisitorLog' }, // Foreign key reference to visitor model (visitor)
    appointment_date: { type: Date, required: true },  // Date and time of the appointment
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },  // Admin or manager hosting the appointment
    status: { 
        type: String, 
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'  // Current status of the appointment
    },
   // created_at: { type: Date, default: Date.now },  // Timestamp when the appointment was created
    //updated_at: { type: Date, default: Date.now }  // Timestamp when the appointment was last updated
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);

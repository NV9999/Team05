const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    meetingWith: { type: String, required: true }, // Could be admin or manager
    appointmentDate: { type: Date, required: true },
    purpose: { type: String, required: true },
    status: { type: String, enum: ['scheduled', 'cancelled', 'completed'], default: 'scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);

const mongoose = require('mongoose');

const ParkingSlotSchema = new mongoose.Schema({
    slotNumber: { type: String, required: true },
    status: { type: String, enum: ['available', 'occupied'], default: 'available' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Nullable if not assigned
}, { timestamps: true });

module.exports = mongoose.model('ParkingSlot', ParkingSlotSchema);

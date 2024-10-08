const mongoose = require('mongoose');

const ParkingSlotSchema = new mongoose.Schema({
    slot_id: { type: String, required: true, unique: true },  // Unique identifier for the parking slot
    slot_number: { type: String, required: true },  // Number assigned to the parking slot
    status: { 
        type: String, 
        enum: ['available', 'occupied', 'reserved'], 
        default: 'available'  // Status of the parking slot
    },
    tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Foreign key reference to User model (tenant)
    booking_date: { type: Date },  // Date when the parking slot is booked
    visitor: { type: Boolean, default: false },  // True if the slot is for a visitor
    payment_status: { 
        type: String, 
        enum: ['paid', 'unpaid', 'pending'], 
        default: 'unpaid'  // Status of the payment for the parking slot
    },
    created_at: { type: Date, default: Date.now },  // Timestamp when the parking slot record was created
    updated_at: { type: Date, default: Date.now }  // Timestamp when the parking slot record was last updated
}, { timestamps: true });

module.exports = mongoose.model('ParkingSlot', ParkingSlotSchema);

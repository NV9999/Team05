const mongoose = require('mongoose');

const RentPaymentSchema = new mongoose.Schema({
    payment_id: { type: String, required: true, unique: true },  // Unique identifier for the payment
    tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Foreign key reference to User model (tenant)
    payment_date: { type: Date, required: true },  // Date the payment was made
    amount: { type: Number, required: true },  // Amount of the payment
    payment_method: { 
        type: String, 
        enum: ['credit_card', 'debit_card', 'cash', 'bank_transfer', 'online'], 
        default: 'online',  // Method of payment
        required: true 
    },
    payment_status: { 
        type: String, 
        enum: ['paid', 'pending', 'overdue'], 
        default: 'pending'  // Status of the payment
    },
    receipt_url: { type: String },  // URL to payment receipt or document
    payment_due_date: { type: Date, required: true },  // Due date for the payment
    created_at: { type: Date, default: Date.now }  // Timestamp of when the payment record was created
}, { timestamps: true });

module.exports = mongoose.model('RentPayment', RentPaymentSchema);

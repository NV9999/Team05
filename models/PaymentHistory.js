const mongoose = require('mongoose');

const PaymentHistorySchema = new mongoose.Schema({
    transaction_id: { type: String, required: true, unique: true },  // Unique identifier for each payment transaction
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user who made the payment
    amount: { type: Number, required: true },  // Amount paid
    method: { 
        type: String, 
        enum: ['credit_card', 'debit_card', 'cash', 'bank_transfer', 'online'], 
        required: true 
    },  // Payment method used
    status: { 
        type: String, 
        enum: ['paid', 'pending', 'overdue', 'failed'], 
        default: 'paid' 
    },  // Payment status
    date: { type: Date, default: Date.now },  // Date of the transaction
    remarks: { type: String },  // Additional notes about the payment
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('PaymentHistory', PaymentHistorySchema);

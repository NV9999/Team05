const mongoose = require('mongoose');

const RentSchema = new mongoose.Schema({
    rent_id: { type: String, required: true, unique: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rent_due: { type: Number, required: true, default: 650 },
    rent_month: { type: String, required: true },  // e.g., "October 2024"
    rent_due_date: { type: Date, required: true },  // e.g., 10th of each month
    late_fee: { type: Number, default: 0 },
    is_paid: { type: Boolean, default: false },
    payment_reference: { type: String }, // Stripe payment ID
    payment_method: { type: String }, // Credit/Debit
    payment_date: { type: Date },
    pdf_url: { type: String } // URL for the generated PDF
}, { timestamps: true });

module.exports = mongoose.model('Rent', RentSchema);
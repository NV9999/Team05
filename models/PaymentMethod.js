
const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
    paymentMethod_id: { type: String, required: true, unique: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    card_number: { type: String, required: true },
    expiry: { type: String, required: true },
    cvc: { type: String, required: true },
    card_holder_name: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);

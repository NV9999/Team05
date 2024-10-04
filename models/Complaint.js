const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed', 'in_progress'], default: 'open' },
    resolution: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);

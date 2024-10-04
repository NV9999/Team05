const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin/Manager
    issuedDate: { type: Date, required: true },
    expiryDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Notice', NoticeSchema);

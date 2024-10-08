const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    notice_id: { type: String, required: true, unique: true },  // Unique identifier for the notice
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Foreign key reference to User model (admin)
    title: { type: String, required: true },  // Title of the notice
    content: { type: String, required: true },  // Content or description of the notice
    publish_date: { type: Date, required: true },  // Date when the notice is published
    created_at: { type: Date, default: Date.now },  // Timestamp when the notice was created
    updated_at: { type: Date, default: Date.now }  // Timestamp when the notice was last updated
}, { timestamps: true });

module.exports = mongoose.model('Notice', NoticeSchema);

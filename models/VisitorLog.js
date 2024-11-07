const mongoose = require('mongoose');

const VisitorLogSchema = new mongoose.Schema({
    visitor_id: { type: String, required: true, unique: true },  // Unique identifier for the visitor log
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the tenant associated with the visitor
    visitor_name: { type: String, required: true },  // Name of the visitor
    entry_time: { type: Date, required: true },  // Time the visitor entered
    exit_time: { type: Date },  // Time the visitor exited (optional, can be added later)
    purpose: { type: String, required: true },  // Purpose of the visit
    contact_number: { type: String },  // Contact number of the visitor (optional)
}, { timestamps: true });

module.exports = mongoose.model('VisitorLog', VisitorLogSchema);

const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    complaint_id: { type: String, required: true, unique: true },  // Unique identifier for the complaint
    tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Foreign key reference to User model (tenant)
    complaint_type: { type: String, required: true },  // Type of complaint (e.g., maintenance, noise, etc.)
    description: { type: String, required: true },  // Description of the complaint
    status: { 
        type: String, 
        enum: ['pending', 'resolved', 'in_progress'], 
        default: 'pending'  // Status of the complaint
    },
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Admin/manager handling the complaint
    feedback: { type: String },  // Feedback from the tenant after the complaint is resolved
    created_at: { type: Date, default: Date.now },  // Timestamp when the complaint was created
    updated_at: { type: Date, default: Date.now }  // Timestamp when the complaint was last updated
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);

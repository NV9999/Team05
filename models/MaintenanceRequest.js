const mongoose = require('mongoose');

const MaintenanceRequestSchema = new mongoose.Schema({
    request_id: { type: String, required: true, unique: true },  // Unique identifier for the maintenance request
    tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Foreign key reference to User model (tenant)
    description: { type: String, required: true },  // Description of the maintenance issue
    status: { 
        type: String, 
        enum: ['pending', 'in_progress', 'completed'], 
        default: 'pending'  // Current status of the request
    },
    expected_completion: { type: Date },  // Expected completion date for the maintenance task
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Admin or manager handling the request
    created_at: { type: Date, default: Date.now },  // Timestamp when the request was created
    updated_at: { type: Date, default: Date.now }  // Timestamp when the request was last updated
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceRequest', MaintenanceRequestSchema);

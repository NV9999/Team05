const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    service_id: { type: String, required: true, unique: true },  // Unique identifier for the service
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Foreign key reference to User
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },  // Admin handling the service
    service_number: { type: String, required: true, unique: true }, // Unique service number
    service_status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },  // Status of the service
    service_submissionDate: { type: Date, default: Date.now },  // Date when service was requested
    service_title: { type: String, required: true },  // Title of the service request
    service_description: { type: String, required: true },  // Description of the service request
    service_commentFromAdmin: { type: String, default: "Awaiting admin response" },  // Comments from admin regarding the service
    service_dueDate: { type: Date },  // Due date for the service (if applicable)
    service_costTotenant: { type: Number },  // Cost charged to the tenant for the service
    service_feedback: { type: String }  // Feedback from tenant after the service is resolved
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);

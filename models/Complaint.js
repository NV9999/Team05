const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    complaint_id: { type: String, required: true, unique: true },  // Unique identifier for the complaint
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Foreign key reference to User model (tenant)
    complaint_type: { 
        type: String, 
        enum: ['maintenance', 'neighbor', 'amenities'], 
        required: true 
    },  // Type of complaint with specific options
    title: { type: String, required: true },  // Title of the complaint
    description: { type: String, required: true },  // Description of the complaint
    status: { 
        type: String, 
        enum: ['pending', 'resolved'], 
        default: 'pending'  // Status of the complaint
    },
    priority_level: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },  // Priority level of the complaint
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },  // Admin handling the complaint
    feedback: { type: String },  // Feedback from the tenant after the complaint is resolved
    submission_date: { type: Date, required:true },  // Submission date of the complaint
    complaint_number: { type: String, unique: true, required: true },  // Unique complaint number
    comment_from_admin: { type: String, default:"waiting for the statement from admin" },  // Comments from admin regarding the complaint
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);

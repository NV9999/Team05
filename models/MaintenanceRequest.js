const mongoose = require('mongoose');

const MaintenanceRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issueType: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in_progress', 'resolved'], default: 'pending' },
    resolutionDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceRequest', MaintenanceRequestSchema);

const mongoose = require('mongoose');

const RentalAgreementSchema = new mongoose.Schema({
    agreement_id: { type: String, required: true, unique: true },  // Unique agreement identifier
    tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Foreign key reference to User model (tenant)
    start_date: { type: Date, required: true },  // Start date of the rental agreement
    end_date: { type: Date, required: true },  // End date of the rental agreement
    monthly_rent: { type: Number, required: true },  // Monthly rent amount
    security_deposit: { type: Number, required: true },  // Security deposit amount
    agreement_document: { type: String },  // URL or path to the rental agreement document (PDF or image)
    status: { type: String, enum: ['active', 'terminated', 'pending'], default: 'active' },  // Status of the agreement
    created_at: { type: Date, default: Date.now },  // Creation timestamp
    updated_at: { type: Date, default: Date.now }  // Last update timestamp
}, { timestamps: true });

module.exports = mongoose.model('RentalAgreement', RentalAgreementSchema);

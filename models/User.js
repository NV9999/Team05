const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },  // Unique user identifier
    role: { type: String, enum: ['tenant', 'admin', 'manager'], default: 'tenant' },  // User role
    email: { type: String, required: true, unique: true },  // User email
    password_hash: { type: String, required: true },  // Hashed password
    first_name: { type: String, required: true },  // First name
    last_name: { type: String, required: true },  // Last name
    phone_number: { type: String, required: true },  // Phone number
    address: { type: String, required: true },  // Address
    profile_image: { type: String },  // URL or path to profile image
    verification_status: { type: String, enum: ['verified', 'unverified'], default: 'unverified' },  // Email/phone verification status
    verification_code: { type: String },  // Code for verification
    document_upload: { type: String },  // URL or path to uploaded document (ID, lease, etc.)
    created_at: { type: Date, default: Date.now },  // Date of user creation
    updated_at: { type: Date, default: Date.now }  // Date of last update
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    role: { type: String, default: 'tenant' },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    first_name: { type: String },
    last_name: { type: String },
    phone_number: { type: String },
    address: { type: String },
    profile_image: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    verification_status: { type: Boolean, default: false },
    verification_code: { type: String },  // Store the verification code sent to the user
    document_upload: { type: String },
    unit_number: { type: String },  // New field for unit number
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

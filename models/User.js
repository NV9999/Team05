const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    role: { type: String, default: 'tenant' },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    address: { type: String },
    profile_image: { type: String },
    //created_at: { type: Date, default: Date.now },
    //updated_at: { type: Date, default: Date.now },
    verification_status: { type: Boolean, default: false },
    verification_code: { type: String },  // Store the verification code sent to the user
    document_upload: { type: String },
    unit_number: { type: String, required: true, unique: true },
    isUserRegistered: { type: Boolean, default: false },  // New field for unit number
    emergency_contact: { type: String },  // New field for emergency contact information
    last_login: { type: Date }  // New field to track the last login time
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

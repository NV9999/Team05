const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    admin_id: { type: String, required: true, unique: true },  // Unique identifier for the admin
    first_name: { type: String, required: true },  // Admin's first name
    last_name: { type: String, required: true },  // Admin's last name
    email: { type: String, required: true, unique: true },  // Admin's email address, must be unique
    password_hash: { type: String, required: true },  // Hashed password for security
    phone_number: { type: String, required: true, unique: true },  // Admin's phone number, must be unique
    role: { type: String, default: 'admin' },  // Role of the user, default set to 'admin'
    profile_image: { type: String },  // URL or path to the admin's profile image
   // created_at: { type: Date, default: Date.now },  // Timestamp when the admin record was created
    //updated_at: { type: Date, default: Date.now }  // Timestamp when the admin record was last updated
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // Import UUID library
const connectDB = require('../../../database connection/db');

const Admin = require('../../../models/Admin');

connectDB(); // Connect to MongoDB database

const seedAdmin = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('gajera', salt);

    const admin = new Admin({
        admin_id: uuidv4(), // Generate a unique UUID for admin_id
        first_name: 'Pragnesh',
        last_name: 'Gajera',
        email: 'pragnesh', // Username saved as email
        password_hash: hashedPassword,
        phone_number: '1234567890',
        profile_image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    });

    await admin.save();
    console.log('Admin seeded successfully');
};

seedAdmin().catch(console.error);

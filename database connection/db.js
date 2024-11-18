// db.js
const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://10viranininad:ninad123@cluster0.obtu6jf.mongodb.net/team05?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Connection error', err);
        process.exit(1);  // Exit the process if MongoDB connection fails
    }
};

module.exports = connectDB;

const express = require('express');
//const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const hallBookingRoutes = require('./routes/hallBookingRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const rentRoutes = require('./routes/rentRoutes');
const profileRoutes = require('./routes/profileRoutes');
const connectDB = require('./database connection/db');
const adminLoginRoutes = require('./routes/adminRoutes/adminLoginRoutes');
const adminHallRoutes = require('./routes/adminRoutes/adminHallRoutes');

// Create the Express app
const app = express();

// Middleware for parsing JSON
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/hallBooking',hallBookingRoutes);
app.use('/api/complaint', complaintRoutes);
app.use('/api/notice',noticeRoutes);
app.use('/api/services',serviceRoutes);
//app.use('/api/rentPayment',rentRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/adminLoginRoutes',adminLoginRoutes);
app.use('/api/adminHallRoutes',adminHallRoutes);

// Connect to MongoDB
connectDB();

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

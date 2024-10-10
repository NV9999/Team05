const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

// Create the Express app
const app = express();

// Middleware for parsing JSON
app.use(express.json());

app.use('/api/auth', authRoutes);

// MongoDB Connection String directly in mongoose.connect
mongoose.connect('mongodb+srv://10viranininad:ninad123@cluster0.obtu6jf.mongodb.net/team05?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('Connection error', err));

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

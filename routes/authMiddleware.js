const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'pragnesh-BAAPU';  

const authMiddleware = async (req, res, next) => {
    // Check for the Authorization header
    const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find the user based on decoded user_id
        const user = await User.findById(decoded.user_id);

        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }
        
        // Attach user data to the request object
        req.user = user;  // You can store the full user object or just the user_id as needed
        next();
    } catch (err) {
        // Log the error for debugging (optional)
        console.error('Token verification error:', err.message);

        // Return response if the token is invalid or expired
        res.status(401).json({ message: 'Token is not valid', error: err.message });
    }
};

module.exports = authMiddleware;

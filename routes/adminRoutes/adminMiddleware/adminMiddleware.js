const jwt = require('jsonwebtoken');
const Admin = require('../../../models/Admin');

const SECRET_KEY = 'Juhi-Medam';

const adminMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const admin = await Admin.findById(decoded.admin_id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        req.admin = admin;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = adminMiddleware;

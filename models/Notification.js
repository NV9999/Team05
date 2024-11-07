const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    notification_id: { type: String, required: true, unique: true },  // Unique identifier for the notification
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the recipient of the notification
    message: { type: String, required: true },  // Content of the notification
    read_status: { type: Boolean, default: false },  // Boolean indicating if the notification has been read
    timestamp: { type: Date, default: Date.now }  // When the notification was created
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);

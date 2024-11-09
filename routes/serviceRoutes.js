const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Service = require('../models/Service'); //Service model is in the models folder
const authMiddleware = require('./authMiddleware');

// 1. Route to fetch all services created by the user
router.get('/services', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.user_id;

        const services = await Service.find({ user_id: userId });

        if (services.length === 0) {
            return res.status(200).json({ message: 'No service requests found' });
        }

        res.status(200).json({ services });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 2. Route to fetch details of a specific service
router.get('/services/:serviceId', authMiddleware, async (req, res) => {
    try {
        const { serviceId } = req.params;
        const userId = req.user.user_id;

        const service = await Service.findOne({ service_id: serviceId, user_id: userId });

        if (!service) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        res.status(200).json({ service });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 3. Route to delete a specific service request if it’s in "pending" status
router.delete('/services/:serviceId', authMiddleware, async (req, res) => {
    try {
        const { serviceId } = req.params;
        const userId = req.user.user_id;

        const service = await Service.findOne({ service_id: serviceId, user_id: userId });

        if (!service) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        if (service.service_status !== 'pending') {
            return res.status(400).json({ message: 'Only pending services can be deleted' });
        }

        await service.deleteOne();

        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 4. Route to submit feedback for a resolved service
router.post('/services/:serviceId/feedback', authMiddleware, async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { feedback } = req.body;
        const userId = req.user.user_id;

        if (!feedback) {
            return res.status(400).json({ message: 'Feedback is required' });
        }

        const service = await Service.findOne({ service_id: serviceId, user_id: userId });

        if (!service) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        if (service.service_status !== 'resolved') {
            return res.status(400).json({ message: 'Feedback can only be submitted for resolved services' });
        }

        service.service_feedback = feedback;
        await service.save();

        res.status(200).json({ message: 'Feedback sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// 5. Route to create a new service request
router.post('/services/create', authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.user_id;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const serviceId = uuidv4();
        const serviceNumber = `${Math.floor(1000 + Math.random() * 9000)}`;

        const newService = new Service({
            service_id: serviceId,
            user_id: userId,
            service_number: serviceNumber,
            service_status: 'pending',
            service_title: title,
            service_description: description,
            service_submissionDate: new Date(),
        });

        await newService.save();

        res.status(201).json({
            message: 'Service request submitted',
            details: 'Your service request has been submitted to the admin. You will be notified about the actions.'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

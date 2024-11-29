const express = require('express');
const router = express.Router();
const Service = require('../../models/Service');
const User = require('../../models/User');
const Admin = require('../../models/Admin');
const adminMiddleware = require('../adminRoutes/adminMiddleware/adminMiddleware');


router.get('/service',adminMiddleware,async()=>{
    try {
        const service = await Service.find()
        .populate('user_id', 'unit_number');
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/service/:id', adminMiddleware,async(req, res) => {
    try {
        const service = await Service.findById(req.params.id)
       .populate('user_id', 'unit_number');
       if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }
        res.json(service);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
});

router.put('/service/:id/approve',adminMiddleware, async()=>{
     const {comments, dueDate} = req.body;
     try{
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'service not found' });
        }

        if (service.service_status !== 'pending') {
            return res.status(400).json({ error: 'Only pending service can be approved' });
        }

        service.service_status = 'resolved';
        service.service_commentFromAdmin = comments;
        service.service_dueDate = dueDate;
        await service.save();
        res.status(200).json({ message: 'Service resolved successfully', service });
     }catch(error){
         res.status(500).json({ message: error.message });
     }
});





module.exports = router;
const express = require('express');
const router = express.Router();
//const HallBooking = require('../../models/HallBooking');
const Complaint = require('../../models/Complaint');
const User = require('../../models/User');
const Admin = require('../../models/Admin');
const adminMiddleware = require('../adminRoutes/adminMiddleware/adminMiddleware');



router.get('/complaints',adminMiddleware,async () => {
    try {
        const complaints = await Complaint.find()
        .populate('user_id', 'unit_number');
        res.status(200).json(complaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/complaints/:id', adminMiddleware, async () => {
    try {
        const complaint = await Complaint.findById(req.params.id)
        .populate('user_id', 'unit_number');
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.status(200).json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.put('/complaints/:id/resolve',adminMiddleware, async () =>{
    const {comments} = req.body;
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        if(complaint.status !== 'pending')
        {
            return res.status(400).json({ message: 'Complaint is not pending' });
        }

        complaint.status ='resolved';
        complaint.comment_from_admin = comments;
        await complaint.save();
        res.status(200).json({message:'complaint resolved successfully',complaint});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});



module.exports = router;
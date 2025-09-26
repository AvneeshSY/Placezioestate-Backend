const express = require('express');
const Rental = require('../models/RentAggrementDraft');
const router = express.Router();

// Create a new rental record
router.post('/', async (req, res) => {
    try {
        const rental = new Rental(req.body);
        await rental.save();
        res.status(201).json({ message: 'Rental record saved successfully', rental });
    } catch (error) {
        res.status(500).json({ message: 'Error saving rental record', error });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const skip = (page - 1) * limit;
        
        const rentals = await Rental.find().sort({ _id: -1 }).skip(skip).limit(limit);
        const total = await Rental.countDocuments();
        
        res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            rentals
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rental records', error });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) {
            return res.status(404).json({ message: 'Rental record not found' });
        }
        res.status(200).json(rental);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rental record', error });
    }
});

module.exports = router;

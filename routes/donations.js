const express = require('express');
const Donation = require('../models/Donation');
const router = express.Router();

// Create donation
router.post('/', async (req, res, next) => {
    try {
        const donation = await Donation.create(req.body);
        res.status(201).json(donation);
    } catch (err) {
        next(err);
    }
});

// Get all donations
router.get('/', async (req, res, next) => {
    try {
        const donations = await Donation.find()
            .populate('donor', 'name email')
            .sort('-createdAt');
        res.json(donations);
    } catch (err) {
        next(err);
    }
});

// Get donation by ID
router.get('/:id', async (req, res, next) => {
    try {
        const donation = await Donation.findById(req.params.id)
            .populate('donor', 'name email');
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }
        res.json(donation);
    } catch (err) {
        next(err);
    }
});

// Update donation status
router.patch('/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        
        const donation = await Donation.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }
        res.json(donation);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
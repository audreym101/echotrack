const express = require('express');
const Job = require('../models/Job');
const router = express.Router();

// Create job
router.post('/', async (req, res, next) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (err) {
        next(err);
    }
});

// Get all jobs
router.get('/', async (req, res, next) => {
    try {
        const jobs = await Job.find({ status: 'active' })
            .populate('postedBy', 'name email')
            .sort('-createdAt');
        res.json(jobs);
    } catch (err) {
        next(err);
    }
});

// Get job by ID
router.get('/:id', async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name email');
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        next(err);
    }
});

// Update job
router.put('/:id', async (req, res, next) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        next(err);
    }
});

// Delete job
router.delete('/:id', async (req, res, next) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
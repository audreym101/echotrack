const express = require('express');
const Application = require('../models/Application');
const router = express.Router();

// Create application
router.post('/', async (req, res, next) => {
    try {
        const application = await Application.create(req.body);
        res.status(201).json(application);
    } catch (err) {
        next(err);
    }
});

// Get all applications
router.get('/', async (req, res, next) => {
    try {
        const applications = await Application.find()
            .populate('job', 'title company location')
            .populate('applicant', 'name email')
            .sort('-appliedDate');
        res.json(applications);
    } catch (err) {
        next(err);
    }
});

// Get application by ID
router.get('/:id', async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('job', 'title company location')
            .populate('applicant', 'name email');
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(application);
    } catch (err) {
        next(err);
    }
});

// Update application status
router.patch('/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(application);
    } catch (err) {
        next(err);
    }
});

// Get applications by job ID
router.get('/job/:jobId', async (req, res, next) => {
    try {
        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email')
            .sort('-appliedDate');
        res.json(applications);
    } catch (err) {
        next(err);
    }
});

// Get applications by user ID
router.get('/user/:userId', async (req, res, next) => {
    try {
        const applications = await Application.find({ applicant: req.params.userId })
            .populate('job', 'title company location')
            .sort('-appliedDate');
        res.json(applications);
    } catch (err) {
        next(err);
    }
});

// Delete application
router.delete('/:id', async (req, res, next) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json({ message: 'Application deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
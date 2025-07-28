const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverLetter: {
        type: String,
        required: true
    },
    resume: {
        type: String, // URL or file path
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure one application per user per job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
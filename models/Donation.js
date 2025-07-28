const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD',
        required: true
    },
    message: {
        type: String,
        trim: true
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'bank_transfer', 'paypal', 'crypto'],
        required: true
    },
    transactionId: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);
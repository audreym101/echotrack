require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Verify MongoDB URI
if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in .env file');
    process.exit(1);
}

// MongoDB connection with retry logic
const connectDB = async (retryCount = 0, maxRetries = 5) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        if (retryCount < maxRetries) {
            console.log(`⏳ Retrying connection... (${retryCount + 1}/${maxRetries})`);
            setTimeout(() => connectDB(retryCount + 1, maxRetries), 5000);
        } else {
            console.error('❌ Maximum connection retries reached. Exiting...');
            process.exit(1);
        }
    }
};

// Initialize database connection
connectDB();

// Import routes
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/jobs');
const donationRoutes = require('./routes/donations');
const applicationRoutes = require('./routes/applications');

// Basic route
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/applications', applicationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});


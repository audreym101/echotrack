require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/jobs');
const donationRoutes = require('./routes/donations');
const auth = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// Basic route
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' });
});

// API routes
app.use('/api/users', userRoutes); // keep for signup/login
// Protect GET /api/users to only allow authenticated users
app.get('/api/users/me', auth, (req, res) => {
  res.json({ userId: req.user.userId, email: req.user.email, role: req.user.role });
});
app.use('/api/jobs', jobRoutes);
app.use('/api/donations', donationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    if (err.code === 11000) {
        return res.status(409).json({ 
            error: 'Duplicate key error', 
            field: Object.keys(err.keyPattern)[0] 
        });
    }
    res.status(500).json({ error: err.message || 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server is live!`);

});


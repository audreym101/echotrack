require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const usersRouter = require('./routes/users');

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

// Routes
app.use('/api/users', usersRouter);

// Health check endpoint
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});


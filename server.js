require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/jobs');
const donationRoutes = require('./routes/donations');
const auth = require('./middleware/auth');

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Health route
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Basic route
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

// API routes
app.use('/api/users', userRoutes); // keep for signup/login
// Protect GET /api/users/me to only allow authenticated users
app.get('/api/users/me', auth, (req, res) => {
  res.json({ userId: req.user.userId, email: req.user.email, role: req.user.role });
});
app.use('/api/jobs', jobRoutes);
app.use('/api/donations', donationRoutes);

// Fallback to static file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// 404 handler (should come before the error handler)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (last)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  // handle mongoose duplicate key error
  if (err && err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate key error',
      details: err.keyValue || err.message
    });
  }
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


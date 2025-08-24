const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connect with reuse across invocations
let cached = global.__MONGO_CACHED__;
if (!cached) {
  cached = global.__MONGO_CACHED__ = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// connect once (optional — ensures connection attempt on cold start)
connectDB().catch(err => console.error('Mongo connect error', err));

// Mount routes (adjust paths if needed)
const userRoutes = require('../routes/users');
const jobRoutes = require('../routes/jobs');
const donationRoutes = require('../routes/donations');
const auth = require('../middleware/auth');

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/donations', donationRoutes);

// Return 404 for other API endpoints
app.all('/api/*', (req, res) => res.status(404).json({ error: 'Not found' }));

module.exports = serverless(app);
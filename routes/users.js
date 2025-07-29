const express = require('express');
const router = express.Router();
const User = require('../src/config/src/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Create user
router.post('/', async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        console.log('✅ User created:', user);
        res.status(201).json(user);
    } catch (err) {
        console.error('❌ Error creating user:', err);
        next(err);
    }
});

// Get all users
router.get('/', async (req, res, next) => {
    try {
        const users = await User.find().sort('-createdAt');
        console.log('✅ Retrieved users:', users.length);
        res.json(users);
    } catch (err) {
        console.error('❌ Error fetching users:', err);
        next(err);
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            console.log(`❌ Signup failed: Email already registered (${email})`);
            return res.status(409).json({ message: 'Email already registered' });
        }
        const user = new User({ name, email, password, role });
        await user.save();
        console.log(`✅ Signup success: ${email} (${role})`);
        res.status(201).json({ message: 'User registered', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('❌ Signup error:', err.message);
        res.status(400).json({ message: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`❌ Login failed: No user for email ${email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Plain string comparison for password
        if (user.password !== password) {
            console.log(`❌ Login failed: Wrong password for ${email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        console.log(`✅ Login success: ${email} (${user.role})`);
        res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('❌ Login error:', err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
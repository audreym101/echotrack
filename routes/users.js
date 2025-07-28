const express = require('express');
const router = express.Router();
const User = require('../src/config/src/models/User');

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

module.exports = router;
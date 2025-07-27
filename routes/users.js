const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Create user
router.post('/', async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
});

// Get all users
router.get('/', async (req, res, next) => {
    try {
        const users = await User.find().sort('-createdAt');
        res.json(users);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
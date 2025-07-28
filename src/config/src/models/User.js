const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['jobseeker', 'ngo', 'donor'],
    required: [true, 'Role is required']
  },
  age: {
    type: Number,
    min: [16, 'Minimum age is 16'],
    max: [100, 'Maximum age is 100']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
// This model defines the structure of a User document in MongoDB using Mongoose.
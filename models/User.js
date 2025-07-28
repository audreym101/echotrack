const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    age: { 
        type: Number, 
        default: 18 
    },
    role: {
        type: String,
        enum: ["sys-admin", "ngo-admin", "donor", "job-seeker"],
        default: "donor"
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);
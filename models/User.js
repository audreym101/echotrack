const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
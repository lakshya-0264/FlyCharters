import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'broker', 'operator', 'corporate'],
        default: 'user'
    },
    phone: String,
    passwordHash: String,
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    accessToken: String,
    isMfaEnabled: {
        type: Boolean,
        default: false
    },
    mfaSecret: String,
    failedAttempts: {
        type: Number,
        default: 0
    },
    lastFailedAt: Date
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User; 
const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tokenHash: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600  // expire après 1h
    },
    used: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

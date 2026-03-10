const mongoose = require('mongoose')

const billsSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    proof: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: Date.now()
    }
})

const Bill = mongoose.model('Bills', billsSchema)
module.exports = Bill
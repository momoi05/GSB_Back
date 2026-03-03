const mongoose = require('mongoose')

const billsSchema = new mongoose.Schema({
    date: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true,
    },
    proof: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    createdAt: {
        type: String,
        default: Date.now()
    }
})

const Bill = mongoose.model('Bills', billsSchema)
module.exports = Bill
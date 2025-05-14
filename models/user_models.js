const mongoose = require('mongoose')
const sha256 = require('js-sha256')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email : {
        type:String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role:{
        type: String,
        require: true
    },
    createdAt:{
        type: String,
        default: Date.now()
    }
})

userSchema.pre('save', async function(next) {
    const existingUser = await User.findOne({email: this.email})
    if (existingUser){
        throw new Error('User already exists', {cause: 400})
    }
    this.password = sha256(this.password + process.env.SALT)
    next()
})

userSchema.pre('findOneAndUpdate', async function(next) {
    const existingUser = await User.findOne({email: this.email})
    if (existingUser){
        throw new Error('User already exists', {cause: 400})
    }
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
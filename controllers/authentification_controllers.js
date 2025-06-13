const jwt = require('jsonwebtoken');
const  User = require ('../models/user_models');
const sha256 = require ('js-sha256')
const JWT_SECRET = 'your-secret-key'; 

// Login method that will check if the user exists and if the password is correct returns a token
const login = async (req, res) => {
    const {email, password}=req.body
    const user = await User.findOne({email})
    if(!user){
     return res.status(401).json({message:'invalid email or password'})
    }
    if (user.password !== sha256(password + process.env.SALT)){
       return res.status(401).json({message: 'invalid email or password'})
    }
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email}, process.env.JWT_SECRET, {expiresIn: '24h'})
    res.status(200).json({token})
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1] || req.headers.authorization
    if(!token){
        return res.status(401).json({message: "no token provided"})
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
        if(err){
            return res.status(401).json({message: 'invalid token'})
        }
        req.user = decoded
        next()
    })
}

module.exports = {login, verifyToken, isAdmin} 
const User = require('../models/user_models')

// createUser method that create a user
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        const user = new User({ name, email, password, role })
        await user.save()
        res.status(201).json(user)
    } catch (error) {
        if (error['cause'] === 400) {
            res.status(400).json({ message: error.message })
        } else {
            res.status(500).json({ message: "Server error" })
        }
    }
}

// getUsers method that search a user for email or all users
const getUsers = async (req, res) => {
    try {
        // if email is provided, find user by email else find all users
        const { email } = req.query.email ? { email: req.query.email } : {}
        const users = await User.find(email)
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

// updateUser method that update a user by email
const updateUser = async (req, res) => {
    try {
        const { email } = req.query
        const { name, newEmail, password, role, } = req.body
        const newPassword = password && sha256(password)
        const user = await User.findOneAndUpdate(
            { email },
            { name, email: newEmail, password: newPassword, role, },
            { new: true }
        )
        if (!user) {
            throw new Error('User not found', { cause: 404 })
        }

        res.status(200).json(user)
    } catch (error) {
        if (error['cause'] === 404) {
            res.status(404).json({ message: error.message })
        }
        if (error['cause'] === 400) {
            res.status(400).json({ message: error.message })
        }
        else {
            res.status(500).json({ message: "Server error" })
        }
    }
}

// deleteUser method that detete a user by email
const deleteUser = async (req, res) => {
    try {
        const { email } = req.query
        await User.findOneAndDelete({ email })
        res.status(200).json({ message: 'User delete' })
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
}

module.exports = { createUser, getUsers, updateUser, deleteUser }
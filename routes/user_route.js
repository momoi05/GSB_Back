const express = require('express')
const router = express.Router()
const { 
    createUser, 
    getUsers, 
    getUsersByEmail, 
    updateUser, 
    deleteUser 
} = require('../controllers/user_controllers')
const authentificationController = require ('../controllers/authentification_controllers')

// Route to create a new user
router.post('/', createUser)

// Route to get all user or user by email
router.get('/', authentificationController.verifyToken, getUsers)

// Route to update a user
router.put('/', authentificationController.verifyToken, updateUser)

// Route to delete a user
router.delete('/', authentificationController.verifyToken, deleteUser)

module.exports = router

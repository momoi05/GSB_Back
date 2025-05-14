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

// Route pour créer un nouvel utilisateur
router.post('/', createUser)

// Route pour obtenir tous les utilisateurs
router.get('/', authentificationController.verifyToken, getUsers)

// Route pour mettre à jour un utilisateur
router.put('/', authentificationController.verifyToken, updateUser)

// Route pour supprimer un utilisateur
router.delete('/', authentificationController.verifyToken, deleteUser)

module.exports = router

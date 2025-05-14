const express = require('express')
const router = express.Router()
const { 
    createBill, 
    getBills, 
    getBillsById, 
    updateBill, 
    deleteBill 
} = require('../controllers/bills_controllers')
const authentificationController = require ('../controllers/authentification_controllers')
const upload = require('../middlewares/upload')

// Route pour créer une nouvelle facture
router.post('/', authentificationController.verifyToken, upload.single('proof'), createBill)

// Route pour obtenir toutes les factures
router.get('/', authentificationController.verifyToken, getBills)

// Route pour obtenir une facture par preuve
router.get('/:id', authentificationController.verifyToken, getBillsById)

// Route pour mettre à jour une facture
router.put('/:id', authentificationController.verifyToken, updateBill)

// Route pour supprimer une facture
router.delete('/:id', authentificationController.verifyToken, deleteBill)

module.exports = router

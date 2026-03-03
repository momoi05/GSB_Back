const express = require('express')
const router = express.Router()
const {
    createBill,
    getBills,
    getBillsById,
    updateBill,
    deleteBill
} = require('../controllers/bills_controllers')
const authentificationController = require('../controllers/authentification_controllers')
const upload = require('../middlewares/upload')

// Route to create a new bill
router.post('/', authentificationController.verifyToken, upload.single('proof'), createBill)

// Route to get all bills
router.get('/', authentificationController.verifyToken, getBills)

// Route to get a bill by ID
router.get('/:id', authentificationController.verifyToken, getBillsById)

// Route to update a bill
router.put('/:id', authentificationController.verifyToken, updateBill)

// Route to delete a bill
router.delete('/:id', authentificationController.verifyToken, deleteBill)

module.exports = router

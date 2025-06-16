
const Bill = require('../models/bills_models')
const { uploadToS3 } = require('../utils/s3')

// CreateBill method that create a bill for user
const createBill = async (req, res) => {
    try {
        const { date, amount, description, status, type } = JSON.parse(req.body.metadata)
        console.log(date, amount, description, status, type)
        const { id } = req.user

        //Upload file
        let proofUrl = null
        if (req.file) {
            proofUrl = await uploadToS3(req.file)
        } else {
            throw new Error('Proof image is requierd', { cause: 400 })
        }
        const bill = new Bill({ date, amount, proof: proofUrl, description, status, type, user: id })
        await bill.save()
        res.status(201).json(bill)

    } catch (error) {
        if (error['cause'] === 400) {
            res.status(400).json({ message: error.message })
        }
        else {
            console.error('error creating bill:', error)
            res.status(500).json({ message: "Server error" })
        }
    }
}

// GetBills method that search user's bills
const getBills = async (req, res) => {
    try {
        const { id, role } = req.user
        let bills
        if (role === 'admin') {
            bills = await Bill.find({})
        } else {
            bills = await Bill.find({ user: id })
        }
        res.status(200).json(bills)
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
}

// GetBillsById method that search user's bills by their ID
const getBillsById = async (req, res) => {
    try {
        const { id } = req.params
        const bill = await Bill.findOne({ _id: id })
        if (!bill) {
            throw new Error('Bill not found', { cause: 404 })
        }
        res.status(200).json(bill)
    } catch (error) {
        if (error['cause'] === 404) {
            res.status(404).json({ message: error.message })
        } else {
            console.log(error)
            res.status(500).json({ message: "Server error" })
        }
    }
}

// updateBill method that update user's bills by their ID
const updateBill = async (req, res) => {
    try {
        const { id } = req.params
        const { date, amount, proof, description, status, type } = req.body
        const bill = await Bill.findOneAndUpdate(
            { _id: id },
            { date, amount, proof, description, status, type },
            { new: true }
        )
        if (!bill) {
            throw new Error('Bill not found', { cause: 404 })
        }
        res.status(200).json(bill)
    } catch (error) {
        if (error['cause'] === 404) {
            res.status(404).json({ message: error.message })
        } else {
            res.status(500).json({ message: "Server error" })
        }
    }

}

// deleteBill method that delete user's bills by their ID
const deleteBill = async (req, res) => {
    try {
        const { id } = req.params
        const bill = await Bill.findOneAndDelete({ id })
        res.status(200).json({ message: 'Bill delete' })
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }

}

module.exports = { createBill, getBills, getBillsById, updateBill, deleteBill }
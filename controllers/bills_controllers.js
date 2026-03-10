
const Bill = require('../models/bills_models')
const { uploadToS3 } = require('../utils/s3')

// CreateBill method that create a bill for user
const createBill = async (req, res) => {
    console.log('[BILL] ▶️ createBill appelé');
    console.log('[BILL] headers:', req.headers);
    console.log('[BILL] user (req.user):', req.user);
    console.log('[BILL] body brut (keys):', Object.keys(req.body || {}));

    try {
        // Parsing sécurisé du metadata
        const rawMetadata = req.body?.metadata;
        console.log('[BILL] metadata brut:', rawMetadata);

        if (!rawMetadata) {
            console.error('[BILL] metadata manquant dans le body');
            return res.status(400).json({ message: 'metadata is required' });
        }

        let parsedMetadata;
        try {
            parsedMetadata = JSON.parse(rawMetadata);
        } catch (parseError) {
            console.error('[BILL] Erreur de parsing JSON du metadata:', parseError);
            return res.status(400).json({ message: 'Invalid metadata JSON' });
        }

        const { date, amount, description, status, type } = parsedMetadata;
        console.log('[BILL] metadata parsé:', { date, amount, description, status, type });

        const { id } = req.user || {};
        console.log('[BILL] user id utilisé pour la facture:', id);

        // Upload file
        let proofUrl = null;
        console.log('[BILL] fichier reçu (req.file):', req.file && {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });

        if (req.file) {
            try {
                console.log('[BILL] ▶️ Upload vers S3 en cours…');
                proofUrl = await uploadToS3(req.file);
                console.log('[BILL] ✅ Upload S3 terminé, url:', proofUrl);
            } catch (uploadError) {
                console.error('[BILL] ❌ Erreur lors de l’upload S3:', uploadError);
                return res.status(500).json({ message: 'Error uploading proof file' });
            }
        } else {
            console.error('[BILL] Aucun fichier fourni (req.file est null/undefined)');
            throw new Error('Proof image is requierd', { cause: 400 });
        }

        const bill = new Bill({ date, amount, proof: proofUrl, description, status, type, user: id });
        await bill.save();
        console.log('[BILL] ✅ Facture créée avec succès:', bill._id);

        res.status(201).json(bill);

    } catch (error) {
        console.error('[BILL] ❌ Erreur dans createBill:', error);
        if (error['cause'] === 400) {
            return res.status(400).json({ message: error.message });
        } else {
            return res.status(500).json({ message: "Server error" });
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
        const bill = await Bill.findOneAndDelete({ _id:id })
        res.status(200).json({ message: 'Bill delete' })
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }

}

module.exports = { createBill, getBills, getBillsById, updateBill, deleteBill }
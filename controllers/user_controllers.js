const User = require('../models/user_models')
const crypto = require("crypto");
const PasswordResetToken = require('../models/password_reset_token_models');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");  // pour envoyer l'email
const { v4: uuidv4 } = require('uuid');
const sendgridTransport = require('nodemailer-sendgrid');

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
        const { email } = req.query;

        let users;

        if (email) {
            users = await User.find({ email });
        } else {
            users = await User.find();
        }
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" })
    }
}

// updateUser method that update a user by email
const updateUser = async (req, res) => {
    try {
        const { email } = req.query;
        const { name, newEmail, password, role } = req.body;

        const updateFields = {};
        if (name) updateFields.name = name;
        if (newEmail) updateFields.email = newEmail;
        if (password) updateFields.password = crypto.createHash('sha256').update(password).digest('hex');
        if (role) updateFields.role = role;

        const user = await User.findOneAndUpdate(
            { email },
            updateFields,
            { new: true }
        );

        if (!user) {
            throw new Error('User not found', { cause: 404 });
        }

        res.status(200).json(user);
    } catch (error) {
        if (error['cause'] === 404) {
            res.status(404).json({ message: error.message });
        } else if (error['cause'] === 400) {
            res.status(400).json({ message: error.message });
        } else {
            console.log(error);
            res.status(500).json({ message: "Server error" });
        }
    }
};

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

// forgotPassword method that allows you to send a link to reset your password.
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        // Toujours répondre pareil pour ne pas révéler les emails
        if (!user) {
            return res.status(200).json({ message: 'Si cet email est connu, un lien vous a été envoyé.' });
        }

        // Créer token sécurisé
        const token = uuidv4();
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Enregistrer en base
        await PasswordResetToken.create({
            userId: user._id,
            tokenHash
        });

        // Envoyer l'email (à adapter selon ton SMTP config)
        const resetLink = `http://localhost:5173/reset-password?token=${token}&id=${user._id}`;
        const transporter = nodemailer.createTransport(
            sendgridTransport({
              apiKey: process.env.SENDGRID_API_KEY
            })
          );
          
          await transporter.sendMail({
            to: user.email,
            from: 'momoi.satsuki.0506@gmail.com', 
            subject: 'Réinitialisation de mot de passe',
            html: `
              <p>Bonjour ${user.name},</p>
              <p>Pour réinitialiser votre mot de passe, cliquez sur ce lien :</p>
              <a href="${resetLink}">${resetLink}</a>
              <p>Ce lien est valable 1 heure.</p>
            `
          });

        res.status(200).json({ message: 'Si cet email est connu, un lien vous a été envoyé.' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// resetPassword method that reset your password.
const resetPassword = async (req, res) => {
    try {
        const { token, userId, newPassword } = req.body;

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const resetRecord = await PasswordResetToken.findOne({
            userId: userId,
            tokenHash,
            used: false
        });

        if (!resetRecord) {
            return res.status(400).json({ message: 'Lien invalide ou expiré.' });
        }

        // Vérifie que ce n’est pas expiré (en théorie l’index TTL "expires" s’en charge)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        // Mettre à jour le mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne(
            { _id: userId },
            { $set: { password: hashedPassword } }
        );

        // Invalider le token
        resetRecord.used = true;
        await resetRecord.save();

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { createUser, getUsers, updateUser, deleteUser, resetPassword, forgotPassword }
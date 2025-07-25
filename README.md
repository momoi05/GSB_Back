
Backend de l'application GSB, développé avec Node.js et Express.

Technologies utilisées
Node.js
Express
PostMan
AWS S3
architecture MVC

# GSB Backend
Backend de l'application GSB gestionnaire de note de frais, développé avec Node.js et Express.

## Technologies utilisées
Node.js
Express
AWS S3
architecture MVC

## 🚀 Fonctionnalités

- Authentification JWT
- Gestion des utilisateurs
- Gestion des factures
- Upload de fichiers (middleware)
- Architecture MVC
- Connexion à une base de données (MongoDB)

## 📁 Structure du projet

```
enigma_backend/
├── controllers/       # Logique métier
├── middlewares/       # Middlewares personnalisés
├── models/            # Schémas de données
├── routes/            # Définition des routes de l’API
├── utils/             # Fonctions utilitaires (ex : AWS S3)
├── .env               # Variables d’environnement
├── index.js           # Fichier principal
```

## 🔧 Installation

```bash
# Clone le repo
git clone https://github.com/tonusername/enigma_backend.git
cd enigma_backend

# Installe les dépendances
npm install

# Configure les variables d'environnement
cp .env.example .env
# Modifie les valeurs selon ton environnement

# Lance le serveur
npm start
```

## 📌 Pré-requis

- Node.js >= 16
- npm >= 8
- MongoDB
- Un fichier `.env` correctement rempli

## 🧪 Tests

```bash
npm test
```

## 👥 Contribuer

1. Fork le projet
2. Crée ta branche `git checkout -b feature/ma-fonctionnalite`
3. Commit tes changements `git commit -m "Ajoute une fonctionnalité"`
4. Push sur la branche `git push origin feature/ma-fonctionnalite`
5. Ouvre une Pull Request

## 📬 Contact

Projet réalisé par [Taraschini Tessa](https://github.com/momoi05)  
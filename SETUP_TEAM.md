# 🚀 Setup du Projet pour les Membres de l'Équipe

## Prérequis
- Node.js (version 16+)
- PostgreSQL (installé et configuré avec un mot de passe)

### Installation de PostgreSQL (si pas déjà fait)
Sur Windows, installez PostgreSQL via Winget :
```bash
winget install PostgreSQL.PostgreSQL.17 --accept-source-agreements --accept-package-agreements
```
Vérifiez que le service `postgresql-x64-17` est démarré.

## Étapes d'Installation

### 1. Cloner le projet
```bash
git clone https://github.com/AdamBY92/pojet-dev-web.git
cd pojet-dev-web
```

### 2. Configurer PostgreSQL

#### a) Vérifier l'installation
```bash
psql --version
```

#### b) Créer la base de données
```bash
# Windows avec PostgreSQL dans le PATH
psql -U postgres -c "CREATE DATABASE event_management;"

# OU avec le chemin complet (adapter selon votre version)
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -U postgres -c "CREATE DATABASE event_management;"
```

**Note pour Windows :** Si vous avez une erreur d'authentification, modifiez le fichier `pg_hba.conf` (dans `C:\Program Files\PostgreSQL\17\data\pg_hba.conf`) pour changer `scram-sha-256` en `trust` pour les lignes `local`, `host 127.0.0.1/32` et `host ::1/128`. Puis redémarrez le service PostgreSQL.

#### c) Configurer le fichier .env
Dans `backend/.env`, modifier avec **VOTRE** mot de passe PostgreSQL :
```env
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/event_management
JWT_SECRET=super_secret_jwt_key_2025_dev_web_project
```

**Alternative pour éviter les problèmes de mot de passe :** Utilisez SQLite en modifiant `.env` :
```env
DATABASE_URL=sqlite:./event_management.db
JWT_SECRET=super_secret_jwt_key_2025_dev_web_project
```
Installez sqlite3 : `npm install sqlite3` dans le backend.

### 3. Installer les dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 4. Initialiser la base de données
```bash
cd backend
node scripts/seed.js
```

✅ **Cette commande va créer :**
- Toutes les tables nécessaires
- Les utilisateurs de test
- Des événements d'exemple
- Des catégories

### 5. Lancer l'application

#### Terminal 1 - Backend (port 5000)
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend (port 5173)
```bash
cd frontend
npm run dev
```

### 6. Accéder à l'application
- **Frontend :** http://localhost:5173
- **Backend API :** http://localhost:5000

## 🔐 Comptes de Test

Après avoir exécuté le seed, vous pouvez vous connecter avec :

### Admin
- **Email :** admin@app.com
- **Mot de passe :** Admin123!

### Utilisateurs
- **Email :** user@app.com
- **Mot de passe :** User123!

- **Email :** jean@app.com
- **Mot de passe :** User123!

## 🐛 Problèmes Fréquents

### Erreur "identifiants invalides"
➡️ Vous n'avez pas exécuté `node scripts/seed.js` dans le backend

### Erreur "la base de données n'existe pas"
➡️ Créez la base avec la commande psql ci-dessus

### Port 5173 ou 5000 déjà utilisé
➡️ Tuez les processus existants :
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID [NUMERO_PID] /F
```

### Problème de connexion PostgreSQL
➡️ Vérifiez que :
- PostgreSQL est démarré
- Le mot de passe dans `.env` est correct
- Le port 5432 est bien utilisé par PostgreSQL
- Si erreur d'authentification, suivez la note ci-dessus pour configurer `trust` dans `pg_hba.conf`

## 📌 Important pour Git

- **TOUJOURS** faire des commits individuels
- **NE JAMAIS** commit le fichier `.env` (déjà dans .gitignore)
- Utilisez des messages de commit clairs : `Feature:`, `Fix:`, `Config:`
- Avant de push : `git pull origin main`

## 🆘 Besoin d'aide ?
Contactez l'équipe sur le groupe Discord/WhatsApp

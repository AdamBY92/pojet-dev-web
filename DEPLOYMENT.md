# DÉPLOIEMENT ET LANCEMENT

## 🚀 Première utilisation

### Étape 1 : Cloner et installer

```bash
# Cloner le dépôt
git clone https://github.com/AdamBY92/pojet-dev-web
cd pojet-dev-web

# Configurer le backend
cd backend
cp .env.example .env
# Éditer .env avec vos paramètres de base de données
npm install

# Retourner à la racine
cd ..

# Configurer le frontend
cd frontend
npm install
```

### Étape 2 : Initialiser la base de données

```bash
# Depuis le dossier backend
cd backend

# Créer la base de données PostgreSQL (si nécessaire)
# psql -U postgres
# CREATE DATABASE events_app;
# \q

# Alimenter la base avec les données de test
npm run seed
```

### Étape 3 : Démarrer l'application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Le serveur écoute sur http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# L'application est disponible sur http://localhost:5173
```

## 📝 Scripts disponibles

### Backend

```bash
npm run dev      # Démarrer le serveur en mode développement
npm run seed     # Initialiser la base de données avec les données de test
npm start        # Démarrer en mode production
npm test         # Lancer les tests (si disponibles)
```

### Frontend

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Compiler pour la production
npm run preview  # Prévisualiser la version compilée
npm run lint     # Vérifier le code
```

## 🔐 Variables d'environnement importantes

### Backend (.env)

- `DATABASE_URL` : URL de connexion à PostgreSQL
- `JWT_SECRET` : Clé secrète pour les tokens JWT (à générer)
- `PORT` : Port du serveur (défaut: 5000)
- `NODE_ENV` : Environnement (development/production)

### Frontend

Les variables sont dans les fichiers `.env` ou `vite.config.js`
- L'API est configurée pour pointer vers `http://localhost:5000`

## 🗄️ Base de données

### Modèles créés lors du seed

- **Users** : Administrateurs et utilisateurs normaux
- **Events** : Événements avec toutes les métadonnées
- **Categories** : Catégories d'événements
- **Registrations** : Inscriptions des utilisateurs aux événements

### Données de test créées

- 1 Admin : `admin@app.com` / `Admin123!`
- 2 Utilisateurs : `user@app.com` et `jean@app.com` / `User123!`
- 6 Événements variés
- Plusieurs catégories pré-créées

## 🔍 Vérification de l'installation

### Backend

```bash
# Vérifier que le serveur démarre correctement
cd backend
npm run dev

# Vous devriez voir: "Serveur démarré sur le port 5000"
```

### Frontend

```bash
# Vérifier que le développement démarre
cd frontend
npm run dev

# Vous devriez voir: "Local: http://localhost:5173/"
```

### API

```bash
# Tester un endpoint
curl http://localhost:5000/api/events

# Vous devriez recevoir un JSON avec la liste des événements
```

## 🚨 Troubleshooting

### Erreur de connexion à PostgreSQL

```bash
# Vérifiez que PostgreSQL est en cours d'exécution
# Sous Windows:
# - Démarrer > Services > PostgreSQL

# Vérifiez la URL dans .env
# Format: postgresql://user:password@host:port/database_name
```

### Port déjà utilisé

```bash
# Changez le port dans backend/.env
PORT=5001

# Ou trouvez le processus utilisant le port
# Linux/Mac: lsof -i :5000
# Windows: netstat -ano | findstr :5000
```

### Erreur npm install

```bash
# Effacer le cache npm
npm cache clean --force

# Supprimer node_modules et recommencer
rm -rf node_modules package-lock.json
npm install
```

## 📱 Utilisation de l'application

### Parcours utilisateur classique

1. Accéder à http://localhost:5173
2. Créer un compte ou se connecter
3. Consulter les événements disponibles
4. Filtrer par catégorie, date, statut
5. S'inscrire à un événement
6. Gérer ses inscriptions dans "Mes Inscriptions"

### Parcours administrateur

1. Se connecter avec `admin@app.com` / `Admin123!`
2. Accéder au tableau de bord admin
3. Créer/modifier/supprimer des événements
4. Gérer les catégories d'événements
5. Consulter les statistiques globales

## 🔄 Mise à jour du code

```bash
# Récupérer les dernières modifications
git pull origin main

# Réinstaller les dépendances si nécessaire
cd backend && npm install
cd ../frontend && npm install

# Relancer l'application
```

## 💾 Sauvegarde de données

```bash
# Exporter la base de données
pg_dump -U username -h localhost events_app > backup.sql

# Importer une sauvegarde
psql -U username -h localhost events_app < backup.sql
```

## 🆘 Besoin d'aide ?

Consultez:
- `README.md` : Documentation générale
- Dossier `backend/` : Code serveur
- Dossier `frontend/` : Code client
- GitHub Issues : Pour les problèmes détectés

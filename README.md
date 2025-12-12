# Application de Gestion d'Événements

Une application full-stack moderne pour créer, administrer et consulter des événements avec gestion des inscriptions et système de rôles.

## 🎯 Fonctionnalités principales

### Pour les utilisateurs
- ✅ Créer un compte et se connecter
- 📅 Consulter tous les événements publics
- 🔍 Filtrer les événements par catégorie, statut, date
- 📝 S'inscrire aux événements
- 📋 Gérer ses inscriptions
- 👤 Voir les détails des événements

### Pour les administrateurs
- 🛠️ Créer, modifier et supprimer des événements
- 📂 Gérer les catégories d'événements
- 📊 Voir les statistiques globales
- 👥 Gérer les événements privés
- 🔐 Contrôler les accès aux ressources

## 🔒 Sécurité

- **Authentification JWT** : Tokens sécurisés pour les sessions utilisateur
- **Autorisation basée sur les rôles** (RBAC) :
  - Les utilisateurs n'accèdent qu'à leurs propres données ou aux éléments publics
  - Les administrateurs ont accès à toutes les ressources
  - Les droits sont vérifiés côté serveur
- **Validation des données** : Toutes les entrées sont validées
- **Gestion des permissions** : Impossible de modifier/supprimer les ressources d'autres utilisateurs

## 📋 Prérequis

- **Node.js** (v14+)
- **npm** ou **yarn**
- **PostgreSQL** (v12+)

## 🚀 Installation et démarrage

### 1. Cloner le dépôt

```bash
git clone https://github.com/AdamBY92/pojet-dev-web
cd pojet-dev-web
```

### 2. Configuration de la base de données PostgreSQL

⚠️ **Important** : Chaque développeur doit avoir PostgreSQL installé localement.

**Créez la base de données :**

```bash
# Windows avec psql dans le PATH
psql -U postgres -c "CREATE DATABASE event_management;"

# OU avec le chemin complet (adapter selon votre version)
& 'C:\Program Files\PostgreSQL\XX\bin\psql.exe' -U postgres -c "CREATE DATABASE event_management;"
```

### 3. Configuration du backend

**Copiez le fichier d'exemple :**

```bash
cd backend
cp .env.example .env
```

**Modifiez le fichier `.env` avec VOS identifiants PostgreSQL :**

```env
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/event_management
JWT_SECRET=super_secret_jwt_key_2025_dev_web_project
PORT=5000
```

⚠️ **Remplacez `VOTRE_MOT_DE_PASSE` par votre mot de passe PostgreSQL réel !**

**Installez les dépendances et initialisez la base de données :**

```bash
npm install
node scripts/seed.js  # Crée les tables et données de test
npm run dev
```

Le backend sera accessible sur `http://localhost:5000`

**Comptes de test créés par le seed :**
- Admin : `admin@app.com` / `Admin123!`
- User : `user@app.com` / `User123!`

### 4. Configuration du frontend

Dans un nouveau terminal :

```bash
cd frontend
npm install
npm run dev
```

L'application frontend sera accessible sur `http://localhost:5173`

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - S'inscrire
- `POST /api/auth/login` - Se connecter

### Événements (authentification requise pour create/update/delete)
- `GET /api/events` - Récupérer tous les événements (avec filtres)
  - Paramètres de requête : `categoryId`, `status`, `search`, `dateFrom`, `dateTo`
- `GET /api/events/:id` - Récupérer un événement
- `POST /api/events` - Créer un événement (admin only)
- `PUT /api/events/:id` - Mettre à jour un événement (owner/admin)
- `DELETE /api/events/:id` - Supprimer un événement (owner/admin)

### Catégories
- `GET /api/categories` - Récupérer toutes les catégories
- `GET /api/categories/:id` - Récupérer une catégorie
- `POST /api/categories` - Créer une catégorie (admin only)
- `PUT /api/categories/:id` - Mettre à jour une catégorie (admin only)
- `DELETE /api/categories/:id` - Supprimer une catégorie (admin only)

### Inscriptions
- `GET /api/registrations` - Récupérer mes inscriptions
- `POST /api/registrations` - S'inscrire à un événement
- `DELETE /api/registrations/:id` - Annuler une inscription

### Admin
- `GET /api/admin/stats` - Récupérer les statistiques (admin only)

## 🎨 Composants réutilisables (Frontend)

### DataTable
Composant générique pour afficher et gérer des listes de données
- Tri par colonnes
- Recherche
- Pagination
- Actions personnalisables

### GenericModal
Composant modal réutilisable pour les formulaires
- Support de différents types de champs (text, textarea, select, checkbox, etc.)
- Validation des formulaires
- Gestion des états de chargement

Utilisés dans :
- Page Événements (création/édition)
- Admin Dashboard (gestion des catégories)
- Partout où un formulaire modal est nécessaire

## 📱 Structure du projet

```
pojet-dev-web/
├── backend/
│   ├── config/              # Configuration base de données
│   ├── controllers/         # Logique métier
│   ├── middleware/          # Auth, validation, etc.
│   ├── models/              # Modèles Sequelize
│   ├── routes/              # Définition des routes
│   ├── server.js            # Point d'entrée
│   └── .env                 # Variables d'environnement
│
└── frontend/
    ├── src/
    │   ├── components/      # Composants réutilisables
    │   ├── pages/           # Pages principales
    │   ├── App.jsx          # Composant racine
    │   └── main.jsx         # Point d'entrée
    └── public/              # Ressources statiques
```

## 👥 Rôles et permissions

### Utilisateur (user)
- Voir les événements publics
- S'inscrire aux événements
- Gérer ses inscriptions
- Voir ses événements privés créés

### Administrateur (admin)
- Créer, modifier, supprimer tous les événements
- Créer, modifier, supprimer les catégories
- Voir les statistiques globales
- Voir tous les événements (publics et privés)

## 🧪 Données de test

Après le premier lancement, vous pouvez utiliser les identifiants suivants pour tester :

**Admin:**
- Email: `admin@app.com`
- Mot de passe: `Admin123!`

**Utilisateur:**
- Email: `user@app.com`
- Mot de passe: `User123!`

## 🔄 Workflow de développement Git

Chaque développeur doit :
1. Créer une branche pour sa tâche : `git checkout -b feature/ma-tache`
2. Faire des commits réguliers avec des messages clairs
3. Pousser la branche : `git push origin feature/ma-tache`
4. Créer une Pull Request (PR) sur le repository

Exemple de messages de commit :
```
feat: Add event filtering by category
fix: Fix validation error in registration form
docs: Update API documentation
```

## 📝 Conventions de code

- **Backend** : Suivre les standards ES6+
- **Frontend** : Utiliser les hooks React et la composition
- **Nommage** : camelCase pour JS, kebab-case pour CSS
- **Fonctions** : Documenter avec des JSDoc

## 🐛 Troubleshooting

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez l'URL de la base de données dans `.env`

### Ports déjà utilisés
- Backend : Changez le port dans `.env`
- Frontend : Vite utilisera automatiquement le prochain port disponible

### Tokens JWT expirés
- Reconnectez-vous pour obtenir un nouveau token

## 📞 Support

Pour toute question ou problème, consultez la documentation des packages utilisés :
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [React](https://react.dev/)
- [Axios](https://axios-http.com/)

## 📄 Licence

Ce projet est développé à titre pédagogique pour l'ESILV.

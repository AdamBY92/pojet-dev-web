# Architecture du projet

## Vue d'ensemble

Cette application suit une architecture **full-stack moderne** avec séparation claire entre le frontend et le backend.

```
┌─────────────────────────────────────────────────────┐
│                  CLIENT (React/Vite)                │
│         Port 5173 - Interface utilisateur           │
└────────────────────┬────────────────────────────────┘
                     │
                   HTTP/REST
                   JWT Token
                     │
┌─────────────────────┴────────────────────────────────┐
│               SERVER (Express.js)                    │
│         Port 5000 - API RESTful                      │
└────────────────────┬────────────────────────────────┘
                     │
                   SQL/Sequelize
                     │
┌─────────────────────┴────────────────────────────────┐
│           BASE DE DONNÉES (PostgreSQL)               │
└──────────────────────────────────────────────────────┘
```

## Backend (Express.js + Sequelize)

### Structure des dossiers

```
backend/
├── config/
│   └── database.js           # Configuration Sequelize
│
├── controllers/
│   ├── authController.js     # Authentification (register, login)
│   ├── eventController.js    # Gestion complète des événements
│   ├── categoryController.js # Gestion des catégories
│   ├── registrationController.js # Gestion des inscriptions
│   └── adminController.js    # Dashboard et statistiques
│
├── middleware/
│   ├── auth.js              # Middleware JWT
│   └── authorization.js     # Contrôle des permissions
│
├── models/
│   ├── User.js              # Modèle utilisateur (2 rôles)
│   ├── Event.js             # Modèle événement
│   ├── Category.js          # Modèle catégorie
│   ├── Registration.js      # Table de jonction User-Event
│   └── index.js             # Associations entre modèles
│
├── routes/
│   ├── authRoutes.js        # Routes d'authentification
│   ├── eventRoutes.js       # Routes des événements
│   ├── categoryRoutes.js    # Routes des catégories
│   ├── registrationRoutes.js # Routes des inscriptions
│   └── adminRoutes.js       # Routes du dashboard admin
│
├── scripts/
│   └── seed.js              # Initialisation des données de test
│
├── server.js                # Point d'entrée principal
├── .env                     # Variables d'environnement (à créer)
├── .env.example             # Template d'environnement
└── package.json             # Dépendances du projet
```

### Modèles de données

#### User
```javascript
{
  id: Integer (PK),
  email: String (unique),
  password: String (bcrypt),
  role: Enum('user', 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

**Relations:**
- Has Many Events (créateur)
- Has Many Registrations

#### Category
```javascript
{
  id: Integer (PK),
  name: String (unique),
  description: Text,
  color: String (hex color),
  createdAt: Date,
  updatedAt: Date
}
```

**Relations:**
- Has Many Events

#### Event
```javascript
{
  id: Integer (PK),
  title: String,
  description: Text,
  date: Date,
  location: String,
  maxParticipants: Integer,
  currentParticipants: Integer (default 0),
  status: Enum('scheduled', 'ongoing', 'completed', 'cancelled'),
  isPublic: Boolean (default true),
  createdBy: Integer (FK User),
  categoryId: Integer (FK Category),
  createdAt: Date,
  updatedAt: Date
}
```

**Relations:**
- Belongs To User (créateur)
- Belongs To Category
- Has Many Registrations

#### Registration
```javascript
{
  id: Integer (PK),
  userId: Integer (FK User),
  eventId: Integer (FK Event),
  createdAt: Date,
  updatedAt: Date
}
```

**Relations:**
- Belongs To User
- Belongs To Event

### Flux d'authentification

```
┌──────────────────┐
│  Utilisateur     │
└────────┬─────────┘
         │
    1.  │ Login/Register
    POST /api/auth/login
         │
         ▼
┌──────────────────────────────┐
│  Vérification des données    │
│  Hash du mot de passe        │
└────────┬─────────────────────┘
         │
    2.  │ Générer JWT
         │
         ▼
┌──────────────────────────────┐
│  Token JWT retourné          │
│  Stocké dans localStorage    │
└──────────────────────────────┘
         │
    3.  │ Chaque requête
    Authorization: Bearer token
         │
         ▼
┌──────────────────────────────┐
│  Middleware authenticate()   │
│  Vérification du token       │
│  Extraction de l'utilisateur │
└──────────────────────────────┘
```

### Flux d'autorisation

```
Requête reçue
     │
     ▼
Authentifiée ?
     │
No   │ → 401 Unauthorized
     │
Yes  │
     ▼
Est-ce un endpoint admin ?
     │
Yes  │ → role === 'admin' ?
     │        │
     │   No   │ → 403 Forbidden
     │        │
     │   Yes  │ ▼ Continuer
     │
No   │
     ▼
   L'utilisateur possède la ressource ?
     │
No   │ → 403 Forbidden
     │
Yes  │ ▼ Continuer
```

### Endpoints API

Voir le README.md pour la liste complète des endpoints avec exemples.

## Frontend (React + Vite)

### Structure des dossiers

```
frontend/
├── src/
│   ├── components/
│   │   ├── Table.jsx         # DataTable générique
│   │   ├── Table.css
│   │   ├── GenericModal.jsx  # Modal réutilisable
│   │   ├── GenericModal.css
│   │   └── PrivateRoute.jsx  # Protection des routes
│   │
│   ├── pages/
│   │   ├── Login.jsx         # Page de connexion
│   │   ├── Events.jsx        # Page principale des événements
│   │   ├── Events.css
│   │   ├── MyRegistrations.jsx # Mes inscriptions
│   │   ├── MyRegistrations.css
│   │   ├── AdminDashboard.jsx # Dashboard admin
│   │   └── AdminDashboard.css
│   │
│   ├── App.jsx               # Routage principal
│   ├── App.css
│   ├── index.css             # Styles globaux
│   └── main.jsx              # Point d'entrée React
│
├── public/                   # Assets statiques
├── index.html                # HTML principal
├── vite.config.js            # Configuration Vite
└── package.json              # Dépendances
```

### Composants génériques réutilisables

#### DataTable

**Utilisation:**
```javascript
<DataTable
  columns={[
    { key: 'title', label: 'Titre', sortable: true },
    { key: 'date', label: 'Date', render: (val) => formatDate(val) }
  ]}
  data={events}
  actions={(row) => <button onClick={() => edit(row)}>Éditer</button>}
  searchableColumns={['title', 'description']}
  itemsPerPage={10}
/>
```

**Fonctionnalités:**
- Tri par colonne
- Recherche en temps réel
- Pagination
- Rendu personnalisé des colonnes
- Actions personnalisables

#### GenericModal

**Utilisation:**
```javascript
<GenericModal
  isOpen={modalOpen}
  title="Créer un événement"
  fields={[
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'date', label: 'Date', type: 'datetime-local' },
    { name: 'description', label: 'Description', type: 'textarea' }
  ]}
  initialData={event}
  onConfirm={handleSave}
  onClose={() => setModalOpen(false)}
/>
```

**Fonctionnalités:**
- Support de multiples types de champs
- Validation des formulaires
- Gestion des erreurs
- États de chargement

### Flow de routage

```
http://localhost:5173
         │
         ▼
    App.jsx (Router)
         │
    ┌────┼────────────────────┐
    │    │                    │
    ▼    ▼                    ▼
 Login  PrivateRoute     PrivateRoute
        │                    │
    ┌───┼────────────────┬───┴─────────┐
    │   │                │            │
    ▼   ▼                ▼            ▼
Events MyRegistrations AdminDashboard (si admin)
    │
    └─ CRUD d'événements
    └─ Filtres & recherche
    └─ Modal pour créer/éditer
```

### État de l'application

L'état est géré localement dans les composants avec `useState`:

```javascript
// État utilisateur (JWT dans localStorage)
localStorage.getItem('token')
localStorage.getItem('user') // JSON de l'utilisateur

// État composant (chaque page gère son état)
const [events, setEvents] = useState([])
const [filters, setFilters] = useState({...})
const [modalOpen, setModalOpen] = useState(false)
```

### Communication API

Utilise **Axios** pour les requêtes HTTP:

```javascript
// Requête avec authentification
const token = localStorage.getItem('token')
const config = { headers: { Authorization: `Bearer ${token}` } }

// GET
const { data } = await axios.get('/api/events', { params: filters })

// POST/PUT/DELETE
await axios.post('/api/events', eventData, config)
```

## Points clés d'intégration

### 1. Authentification
- Le backend émet des tokens JWT
- Le frontend les stocke et les envoie à chaque requête
- Middleware vérifie les tokens sur chaque endpoint protégé

### 2. Autorisation
- Les permissions sont vérifiées côté serveur
- Les utilisateurs ne voient que ce qu'ils peuvent accéder
- Les actions interdites retournent 403 Forbidden

### 3. Validation
- Frontend : validation basique des formulaires
- Backend : validation complète de tous les inputs
- Deux niveaux pour la sécurité

### 4. Gestion des erreurs
- Backend envoie codes HTTP appropriés
- Frontend affiche les messages d'erreur utilisateur
- Logs côté serveur pour le debugging

## Flux complet : Créer un événement

### Backend
```
POST /api/events
  ├─ Middleware authenticate()
  │  └─ Vérifier token JWT
  ├─ Controller createEvent()
  │  ├─ Vérifier role === 'admin'
  │  ├─ Valider les données
  │  ├─ Créer l'événement en DB
  │  └─ Retourner l'événement créé
```

### Frontend
```
User clicks "Créer événement"
  ├─ Modal s'ouvre
  ├─ User remplit le formulaire
  ├─ User clique "Créer"
  ├─ Validation locale
  ├─ Requête POST /api/events
  │  └─ Header: Authorization: Bearer token
  ├─ Si succès:
  │  ├─ Ajouter l'événement à la liste
  │  ├─ Fermer la modal
  │  └─ Afficher "Événement créé"
  └─ Si erreur:
     └─ Afficher le message d'erreur
```

## Sécurité

### Protections en place

1. **JWT** : Tokens pour l'authentification stateless
2. **CORS** : Contrôle des origines
3. **Hashage** : Mots de passe bcryptés
4. **Validation** : Input validation côté serveur
5. **RBAC** : Contrôle d'accès basé sur les rôles
6. **Propriété** : Vérification que l'utilisateur peut modifier sa ressource

### Cas sécurisés

```
✅ Un user ne peut modifier que ses propres événements
✅ Un user ne peut voir que les événements publics d'autres users
✅ Un user ne peut annuler que ses propres inscriptions
✅ Un admin peut tout faire
✅ Les tokens expirent et doivent être renouvellés
✅ Les mots de passe ne sont jamais stockés en clair
```

## Scalabilité future

Pour améliorer le projet :

1. **Caching** : Ajouter Redis pour mettre en cache les événements
2. **WebSockets** : Notifications en temps réel des changements
3. **Tests** : Jest pour le backend et Vitest pour le frontend
4. **CI/CD** : GitHub Actions pour tester et déployer automatiquement
5. **Pagination** : Implémenter la pagination côté serveur
6. **Recherche avancée** : Elasticsearch pour des recherches puissantes
7. **Email** : Notifications par email pour les inscriptions
8. **Fichiers** : Upload d'images pour les événements et profils

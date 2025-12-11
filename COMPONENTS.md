# Guide des Composants Réutilisables

## 📊 DataTable (Table.jsx)

Composant générique pour afficher et gérer des listes de données.

### Utilisation basique

```jsx
import DataTable from '../components/Table';

function MyPage() {
  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Nom', sortable: true },
    { key: 'email', label: 'Email' }
  ];

  const data = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];

  return <DataTable columns={columns} data={data} />;
}
```

### Utilisation avancée avec actions

```jsx
const columns = [
  {
    key: 'title',
    label: 'Titre',
    sortable: true,
    render: (value, row) => <strong>{value}</strong>
  },
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString('fr-FR')
  },
  {
    key: 'status',
    label: 'Statut',
    render: (value) => {
      const colors = {
        active: '#28a745',
        inactive: '#dc3545'
      };
      return <span style={{ color: colors[value] }}>{value}</span>;
    }
  }
];

const actionButtons = (row) => (
  <div>
    <button onClick={() => handleEdit(row)}>Éditer</button>
    <button onClick={() => handleDelete(row.id)}>Supprimer</button>
  </div>
);

<DataTable
  columns={columns}
  data={events}
  actions={actionButtons}
  searchableColumns={['title', 'description']}
  itemsPerPage={10}
/>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `columns` | Array | Configuration des colonnes |
| `data` | Array | Données à afficher |
| `actions` | Function | Fonction retournant les boutons d'action |
| `itemsPerPage` | Number | Nombre d'éléments par page (défaut: 10) |
| `searchableColumns` | Array | Colonnes dans lesquelles chercher |
| `onRowClick` | Function | Callback quand on clique sur une ligne |

### Configuration des colonnes

Chaque colonne doit avoir:

```javascript
{
  key: 'fieldName',           // Clé du champ dans les données
  label: 'Affichage',         // Label du header
  sortable: true,             // (Optionnel) Permet le tri
  render: (value, row) => ({  // (Optionnel) Rendu personnalisé
    // value: la valeur du champ
    // row: toute la ligne
    // retourner React component ou string
  })
}
```

### Fonctionnalités

- ✅ **Tri** : Cliquer sur l'en-tête (si `sortable: true`)
- ✅ **Recherche** : Champ en haut (si `searchableColumns` fourni)
- ✅ **Pagination** : Boutons précédent/suivant
- ✅ **Rendu personnalisé** : Fonction `render` pour chaque colonne
- ✅ **Actions** : Boutons personnalisables par ligne

### Exemple complet : Gestion des utilisateurs

```jsx
function UserManagement() {
  const [users, setUsers] = useState([]);

  const columns = [
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'role',
      label: 'Rôle',
      render: (value) => {
        const badges = {
          'admin': '👑 Admin',
          'user': '👤 User'
        };
        return badges[value] || value;
      }
    },
    {
      key: 'createdAt',
      label: 'Créé le',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('fr-FR')
    }
  ];

  const actions = (user) => (
    <>
      <button onClick={() => handleEdit(user)}>✏️ Éditer</button>
      <button onClick={() => handleDelete(user.id)}>🗑️ Supprimer</button>
    </>
  );

  return (
    <DataTable
      columns={columns}
      data={users}
      actions={actions}
      searchableColumns={['email']}
      itemsPerPage={10}
      onRowClick={(user) => console.log('Cliqué sur:', user)}
    />
  );
}
```

---

## 🎯 GenericModal (GenericModal.jsx)

Composant modal réutilisable pour les formulaires.

### Utilisation basique

```jsx
import GenericModal from '../components/GenericModal';
import { useState } from 'react';

function MyPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const fields = [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true }
  ];

  const handleConfirm = async (formData) => {
    console.log('Données:', formData);
    // Envoyer au serveur
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)}>Ouvrir</button>
      
      <GenericModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Mon formulaire"
        fields={fields}
        onConfirm={handleConfirm}
      />
    </>
  );
}
```

### Utilisation avancée avec tous les types de champs

```jsx
const fields = [
  {
    name: 'title',
    label: 'Titre',
    type: 'text',
    placeholder: 'Entrez le titre...',
    required: true
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Décrivez...',
    rows: 4
  },
  {
    name: 'date',
    label: 'Date',
    type: 'date',
    required: true
  },
  {
    name: 'time',
    label: 'Heure',
    type: 'time'
  },
  {
    name: 'category',
    label: 'Catégorie',
    type: 'select',
    options: [
      { value: 'cat1', label: 'Catégorie 1' },
      { value: 'cat2', label: 'Catégorie 2' }
    ]
  },
  {
    name: 'isPublic',
    label: 'Rendre public',
    type: 'checkbox',
    checkboxLabel: 'Cet élément est public'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email'
  },
  {
    name: 'phone',
    label: 'Téléphone',
    type: 'tel'
  }
];

<GenericModal
  isOpen={isOpen}
  onClose={handleClose}
  title="Créer un événement"
  fields={fields}
  initialData={{
    title: 'Mon événement',
    category: 'cat1'
  }}
  onConfirm={handleSave}
  confirmText="Créer"
  cancelText="Annuler"
  isLoading={isSaving}
/>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | Boolean | Si la modal est ouverte |
| `onClose` | Function | Callback pour fermer |
| `title` | String | Titre de la modal |
| `fields` | Array | Configuration des champs |
| `initialData` | Object | Données initiales du formulaire |
| `onConfirm` | Function | Callback quand valider |
| `confirmText` | String | Texte du bouton valider |
| `cancelText` | String | Texte du bouton annuler |
| `isLoading` | Boolean | Si le formulaire est en cours d'envoi |

### Configuration des champs

Chaque champ peut avoir:

```javascript
{
  name: 'fieldName',           // Clé du champ (requis)
  label: 'Label',              // Affichage du label (requis)
  type: 'text',                // Type de champ (requis)
  placeholder: 'Placeholder',  // Placeholder (optionnel)
  required: true,              // Champ obligatoire (optionnel)
  rows: 4,                     // Pour textarea (optionnel)
  options: [...],              // Pour select (requis si type='select')
  checkboxLabel: 'Label'       // Pour checkbox (optionnel)
}
```

### Types de champs supportés

- `text` - Champ texte
- `email` - Email
- `password` - Mot de passe
- `number` - Nombre
- `date` - Date
- `time` - Heure
- `datetime-local` - Date et heure
- `textarea` - Texte multiligne
- `select` - Liste déroulante
- `checkbox` - Case à cocher
- `tel` - Téléphone
- `url` - URL
- `color` - Sélecteur de couleur

### Exemple complet : Modal de création d'événement

```jsx
function EventCreate() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Charger les catégories
    fetchCategories();
  }, []);

  const fields = [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      rows: 4
    },
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'location', label: 'Lieu', type: 'text', required: true },
    {
      name: 'maxParticipants',
      label: 'Participants max',
      type: 'number',
      required: true
    },
    {
      name: 'categoryId',
      label: 'Catégorie',
      type: 'select',
      options: categories.map(c => ({
        value: c.id,
        label: c.name
      }))
    },
    {
      name: 'isPublic',
      label: 'Public',
      type: 'checkbox',
      checkboxLabel: 'Rendre public'
    }
  ];

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/events', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModalOpen(false);
      alert('Événement créé!');
      // Rafraîchir la liste
      fetchEvents();
    } catch (error) {
      alert('Erreur: ' + error.response.data.error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)}>
        + Créer un événement
      </button>

      <GenericModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Créer un nouvel événement"
        fields={fields}
        onConfirm={handleSave}
        isLoading={isSaving}
        confirmText="Créer"
      />
    </>
  );
}
```

---

## ✨ Bonnes pratiques

### Réutilisabilité

```jsx
// ❌ Mauvais : Duplication de code
// Page1.jsx
const columns = [...];
const data = [...];
<Table columns={columns} data={data} />

// Page2.jsx
const columns = [...]; // Copie du code!
const data = [...];
<Table columns={columns} data={data} />

// ✅ Bon : Créer un composant intermédiaire
// hooks/useDataConfig.js
export function useEventColumns() {
  return [
    { key: 'title', label: 'Titre', sortable: true },
    // ...
  ];
}

// Page1.jsx & Page2.jsx
const columns = useEventColumns();
<Table columns={columns} data={data} />
```

### Validation

```jsx
// ✅ Bonne pratique : Valider avant d'envoyer
const handleConfirm = async (formData) => {
  // Validation supplémentaire si nécessaire
  if (formData.email && !isValidEmail(formData.email)) {
    alert('Email invalide');
    return;
  }

  // Envoyer les données
  await saveData(formData);
};
```

### Gestion des erreurs

```jsx
// ✅ Afficher les erreurs utilisateur
const handleConfirm = async (formData) => {
  try {
    await axios.post('/api/endpoint', formData);
  } catch (error) {
    // Message d'erreur du serveur
    const message = error.response?.data?.error || 'Erreur inconnue';
    alert(message);
  }
};
```

### Performance

```jsx
// ✅ Utiliser useMemo pour les colonnes
const columns = useMemo(() => [
  { key: 'title', label: 'Titre' },
  // ...
], []);

// ✅ Utiliser useCallback pour les handlers
const handleDelete = useCallback((id) => {
  // ...
}, []);
```

---

## 🎓 Exercices

### Exercice 1 : Créer une table d'utilisateurs

```jsx
// Afficher une liste d'utilisateurs avec tri, recherche et pagination
function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // À compléter...
  return <DataTable /* ... */ />;
}
```

### Exercice 2 : Créer une modal de contact

```jsx
// Modal avec champs : nom, email, message
// Validation que l'email est valide
// Envoi au serveur
function ContactModal() {
  // À compléter...
}
```

### Exercice 3 : Combiner les deux

```jsx
// Liste d'utilisateurs + modal pour éditer
// Cliquer sur un utilisateur ouvre la modal pré-remplie
// Envoyer les changements au serveur
function UserManagement() {
  // À compléter...
}
```

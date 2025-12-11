# 🎬 GUIDE UTILISATEUR

## 🔐 Authentification

### Créer un compte

1. Accédez à http://localhost:5173
2. Cliquez sur "S'inscrire"
3. Entrez:
   - Email (unique)
   - Mot de passe (au moins 6 caractères)
4. Cliquez "S'inscrire"
5. Vous êtes maintenant connecté et redirigé vers la page d'accueil

### Se connecter

1. Si vous n'êtes pas connecté, allez sur http://localhost:5173
2. Entrez votre email
3. Entrez votre mot de passe
4. Cliquez "Se connecter"

### Comptes de test pré-créés

**Administrateur:**
```
Email: admin@app.com
Mot de passe: Admin123!
```

**Utilisateurs normaux:**
```
Email: user@app.com
Mot de passe: User123!

Email: jean@app.com
Mot de passe: User123!
```

## 👤 Espace Utilisateur

### 📅 Consulter les événements

1. Cliquez sur "Événements" dans le menu
2. Vous verrez la liste de tous les événements publics
3. Chaque événement affiche:
   - Titre
   - Date et lieu
   - Nombre de participants
   - Statut (Programmé, En cours, Terminé, Annulé)

### 🔍 Filtrer les événements

Dans la page Événements, utilisez les filtres:

**Rechercher** - Cherchez par titre ou description
**Catégorie** - Filtrez par type d'événement
**Statut** - Afficher programmés, en cours, etc.
**Date** - Événements entre deux dates

Les filtres fonctionnent ensemble (AND logique)

### 📝 S'inscrire à un événement

1. Trouvez un événement
2. Cliquez sur le bouton vert "S'inscrire"
3. Confirmation automatique
4. Vous verrez le nombre de participants augmenter

**Cas spéciaux:**
- ❌ **Complet** : Si max participants atteint, bouton grisé
- ❌ **Déjà inscrit** : Bouton désactivé si déjà inscrit

### 📋 Gérer mes inscriptions

1. Cliquez sur "Mes Inscriptions" dans le menu
2. Vous verrez tous les événements auxquels vous êtes inscrit
3. Pour chaque inscription:
   - Titre de l'événement
   - Date et lieu
   - Statut (Programmé, En cours, Terminé, Annulé)
   - Date de votre inscription

4. **Pour annuler une inscription:**
   - Cliquez le bouton rouge "✖️ Annuler"
   - Confirmez
   - Vous êtes supprimé de la liste
   - Le nombre de participants baisse

## 👑 Espace Administrateur

*Accessible uniquement si votre compte est admin*

### 🎯 Accéder au dashboard admin

1. Connectez-vous avec un compte admin
2. Un menu "Admin" apparaît dans la navigation
3. Cliquez "Admin" pour accéder au dashboard

### 📊 Voir les statistiques

1. Dans le dashboard, allez sur l'onglet "📊 Statistiques"
2. Vous verrez:
   - **Utilisateurs** : Nombre total de comptes
   - **Événements** : Nombre total d'événements
   - **Inscriptions** : Nombre total d'inscriptions
   - **Catégories** : Nombre de catégories créées

### 📂 Gérer les catégories

#### Créer une catégorie

1. Allez à l'onglet "📂 Catégories"
2. Cliquez "+ Nouvelle Catégorie"
3. Remplissez:
   - **Nom** : Nom unique de la catégorie (ex: "Technologie")
   - **Description** : Description courte (optionnel)
   - **Couleur** : Choisissez une couleur
4. Cliquez "Créer"

#### Éditer une catégorie

1. Trouvez la catégorie dans la liste
2. Cliquez le bouton ✏️
3. Modifiez les champs
4. Cliquez "Mettre à jour"

#### Supprimer une catégorie

1. Trouvez la catégorie
2. Cliquez le bouton 🗑️
3. Confirmez la suppression

### 📅 Gérer les événements

#### Créer un événement

1. Allez à "Événements"
2. Cliquez "+ Créer un événement"
3. Remplissez le formulaire:
   - **Titre** * (requis)
   - **Description** (optionnel)
   - **Date** * (requis)
   - **Lieu** * (requis)
   - **Participants max** * (requis)
   - **Catégorie** (optionnel)
   - **Statut** (Programmé/En cours/Terminé/Annulé)
   - **Public** (cocher pour rendre public)
4. Cliquez "Créer"

#### Éditer un événement

1. Trouvez votre événement
2. Cliquez le bouton ✏️
3. Modifiez les champs
4. Cliquez "Mettre à jour"

#### Supprimer un événement

1. Trouvez l'événement
2. Cliquez le bouton 🗑️
3. Confirmez la suppression
4. L'événement est supprimé (les inscriptions aussi)

### 🔒 Événements privés

En tant qu'admin, vous pouvez créer des événements **privés**:

1. Lors de la création, **décochez** "Événement public"
2. Les utilisateurs normaux ne verront pas cet événement
3. Seuls vous (créateur) et les admins le verront
4. Vous pouvez toujours y inscrire des utilisateurs

## ⚙️ Fonctionnalités avancées

### Tri et tri dans les listes

- **Cliquez sur l'en-tête** pour trier (▲ croissant, ▼ décroissant)
- Les colonnes sortables ont un curseur spécial

### Pagination

- **Précédent / Suivant** pour naviguer
- Affiche la page actuelle

### Recherche en temps réel

- Tape pour chercher immédiatement
- Recherche dans les colonnes spécifiées

## 🚨 Cas particuliers

### Je ne peux pas créer d'événements

Vous devez être **administrateur**. Contactez un admin pour augmenter votre niveau d'accès.

### Je peux voir un événement mais pas l'éditer

L'événement est **privé** et créé par quelqu'un d'autre. Seul le créateur ou un admin peut l'éditer.

### Le bouton S'inscrire est grisé

L'événement est **complet** (max participants atteint). Attendez qu'une place se libère.

### Je suis déjà inscrit

Vous avez déjà une inscription active. Allez dans "Mes Inscriptions" pour l'annuler d'abord.

## 💡 Astuces

1. **Combinez les filtres** pour trouver exactement ce que vous cherchez
2. **Consultez vos inscriptions** régulièrement pour les statuts des événements
3. **Les admins voient tout** : privés inclus
4. **Les événements publics** sont toujours visibles (sauf s'ils sont privés)
5. **Triez par date** pour voir les événements à venir en premier

## 📱 Responsif

L'application fonctionne sur:
- ✅ Ordinateur (desktop)
- ✅ Tablette
- ✅ Téléphone

L'interface s'adapte automatiquement à la taille de l'écran.

## ⌨️ Raccourcis/Bonnes pratiques

- **Filtrez par date** si vous recherchez un événement précis
- **Utilisez la recherche** pour les titres longs
- **Vérifiez la catégorie** pour les événements du même type
- **Notez les dates** des événements auxquels vous êtes inscrit

## 🆘 Problèmes courants

### "Authentification requise"
Vous n'êtes pas connecté. Reconnectez-vous ou créez un compte.

### "Accès refusé"
Vous n'avez pas les permissions. Vérifiez que:
- Vous êtes le créateur de la ressource (ou admin)
- Votre token n'a pas expiré

### "L'événement n'existe pas"
L'événement a été supprimé ou vous n'avez pas accès à l'événement privé.

### "Inscriptions complète"
Trop de personnes se sont inscrites. Attendez qu'une place se libère.

## 📞 Support

Pour des questions sur l'utilisation:
1. Consultez ce guide
2. Vérifiez le README.md
3. Lisez ARCHITECTURE.md pour les détails techniques

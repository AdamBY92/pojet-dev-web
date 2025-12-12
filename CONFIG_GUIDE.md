# 🔧 Configuration du projet pour les développeurs

## ⚠️ IMPORTANT - Fichier .env

Le fichier `.env` contient des informations sensibles et **NE DOIT PAS** être commité sur Git.

### Pour configurer votre environnement local :

1. **Copiez le fichier d'exemple :**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Modifiez `backend/.env` avec VOS credentials :**
   ```env
   DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/event_management
   JWT_SECRET=super_secret_jwt_key_2025_dev_web_project
   ```

3. **Créez la base de données PostgreSQL :**
   ```bash
   psql -U postgres -c "CREATE DATABASE event_management;"
   ```

4. **Initialisez les données :**
   ```bash
   cd backend
   npm install
   node scripts/seed.js
   ```

## 🔑 Mots de passe PostgreSQL par développeur

Chaque développeur doit utiliser son propre mot de passe PostgreSQL local dans son fichier `.env` :

- **Vadim** : `root123` (exemple)
- **Adam** : Ton propre mot de passe PostgreSQL
- **Mathis** : Ton propre mot de passe PostgreSQL

## ❌ Ne JAMAIS commiter :

- Le fichier `backend/.env` avec vos vrais mots de passe
- Les fichiers `node_modules/`
- Les fichiers de logs
- Les bases de données SQLite ou autres fichiers générés

## ✅ À commiter :

- Le fichier `backend/.env.example` (avec des placeholders)
- Tout le reste du code source
- Les fichiers de configuration

## 🆘 En cas de problème "Erreur de chargement des événements"

1. Vérifiez que PostgreSQL est démarré
2. Vérifiez que la base de données `event_management` existe
3. Vérifiez que le mot de passe dans `.env` est correct
4. Vérifiez que vous avez exécuté `node scripts/seed.js`
5. Redémarrez le backend : `npm run dev`

## 📝 Workflow Git recommandé

1. Travailler sur votre branche personnelle : `git checkout Vadim` (ou Adam/Mathis)
2. Faire vos modifications
3. Commiter : `git add .` puis `git commit -m "Message"`
4. Pusher : `git push origin Vadim`
5. Créer une Pull Request sur GitHub pour merger dans `main`

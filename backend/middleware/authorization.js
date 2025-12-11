/**
 * Middleware pour les routes protégées
 * S'assure que les utilisateurs ne peuvent accéder qu'à leurs propres ressources
 */

const checkOwnership = (modelName) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const { Event, Registration, User } = require('../models');

      let resource = null;

      switch (modelName) {
        case 'Event':
          resource = await Event.findByPk(id);
          if (!resource) {
            return res.status(404).json({ error: 'Événement non trouvé' });
          }
          // Admin ou créateur
          if (req.user.role !== 'admin' && resource.createdBy !== req.user.id) {
            return res.status(403).json({ error: 'Vous n\'avez pas accès à cette ressource' });
          }
          break;

        case 'Registration':
          resource = await Registration.findByPk(id);
          if (!resource) {
            return res.status(404).json({ error: 'Inscription non trouvée' });
          }
          // Admin ou propriétaire de l'inscription
          if (req.user.role !== 'admin' && resource.userId !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez gérer que vos inscriptions' });
          }
          break;

        default:
          return res.status(400).json({ error: 'Modèle invalide' });
      }

      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

module.exports = { checkOwnership };

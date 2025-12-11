const { User, Event, Registration, Category } = require('../models');

/**
 * Récupérer les statistiques globales
 */
exports.getStats = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Droits administrateur requis' });
    }

    const [userCount, eventCount, registrationCount, categoryCount] = await Promise.all([
      User.count(),
      Event.count(),
      Registration.count(),
      Category.count()
    ]);

    res.json({
      userCount,
      eventCount,
      registrationCount,
      categoryCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const { Registration, Event, User } = require('../models');

// Récupérer les inscriptions de l'utilisateur actuel
exports.getRegistrations = async (req, res) => {
  try {
    let where = {};
    
    // Les users ne voient que leurs inscriptions, les admins voient tout
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }
    
    const registrations = await Registration.findAll({
      where,
      include: [
        { model: Event, include: [{ model: User, as: 'creator', attributes: ['id', 'email'] }] },
        { model: User, attributes: ['id', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer une inscription
exports.createRegistration = async (req, res) => {
  try {
    const { eventId } = req.body;
    
    if (!eventId) {
      return res.status(400).json({ error: 'eventId est requis' });
    }
    
    const event = await Event.findByPk(eventId);
    
    if (!event) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    
    // Vérifier si l'événement est complet
    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ error: 'Événement complet' });
    }
    
    // Vérifier si l'utilisateur est déjà inscrit
    const existing = await Registration.findOne({
      where: {
        userId: req.user.id,
        eventId
      }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Vous êtes déjà inscrit à cet événement' });
    }
    
    // Créer l'inscription
    const registration = await Registration.create({
      userId: req.user.id,
      eventId
    });
    
    // Incrémenter le nombre de participants
    await event.increment('currentParticipants');
    
    // Retourner l'inscription avec les détails
    const fullRegistration = await Registration.findByPk(registration.id, {
      include: [
        { model: Event, include: [{ model: User, as: 'creator', attributes: ['id', 'email'] }] },
        { model: User, attributes: ['id', 'email'] }
      ]
    });
    
    res.status(201).json(fullRegistration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Annuler une inscription
exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ error: 'Inscription non trouvée' });
    }
    
    // Vérifier les permissions : owner ou admin
    if (req.user.role !== 'admin' && registration.userId !== req.user.id) {
      return res.status(403).json({ error: 'Vous ne pouvez annuler que vos inscriptions' });
    }
    
    // Supprimer l'inscription
    await registration.destroy();
    
    // Décrémenter le nombre de participants
    const event = await Event.findByPk(registration.eventId);
    await event.decrement('currentParticipants');
    
    res.json({ message: 'Inscription annulée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Registration = require('../models/Registration');
const Event = require('../models/Event');

exports.getRegistrations = async (req, res) => {
  try {
    let where = {};
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }
    const registrations = await Registration.findAll({ where, include: Event });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRegistration = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ error: 'Événement non trouvé' });
    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ error: 'Événement complet' });
    }
    const existing = await Registration.findOne({ where: { userId: req.user.id, eventId } });
    if (existing) return res.status(400).json({ error: 'Déjà inscrit' });
    const registration = await Registration.create({ userId: req.user.id, eventId });
    await event.increment('currentParticipants');
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Inscription non trouvée' });
    if (req.user.role !== 'admin' && registration.userId !== req.user.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }
    await registration.destroy();
    const event = await Event.findByPk(registration.eventId);
    await event.decrement('currentParticipants');
    res.json({ message: 'Inscription annulée' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
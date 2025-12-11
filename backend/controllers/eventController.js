const { Event, Category, User, Registration } = require('../models');
const { Op } = require('sequelize');

// Récupérer tous les événements avec filtres et permissions
exports.getEvents = async (req, res) => {
  try {
    const { categoryId, status, dateFrom, dateTo, search } = req.query;
    let where = {};
    
    // Filtre par public/private selon les permissions
    if (req.user.role !== 'admin') {
      where = {
        [Op.or]: [
          { isPublic: true },
          { createdBy: req.user.id }
        ]
      };
    }
    
    // Filtre par catégorie
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    // Filtre par statut
    if (status) {
      where.status = status;
    }
    
    // Filtre par date
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date[Op.gte] = new Date(dateFrom);
      if (dateTo) where.date[Op.lte] = new Date(dateTo);
    }
    
    // Recherche par titre ou description
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const events = await Event.findAll({
      where,
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'creator', attributes: ['id', 'email'] }
      ],
      order: [['date', 'ASC']]
    });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un événement spécifique
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'creator', attributes: ['id', 'email'] },
        { model: Registration, include: [{ model: User, attributes: ['id', 'email'] }] }
      ]
    });
    
    if (!event) return res.status(404).json({ error: 'Événement non trouvé' });
    
    // Vérifier les permissions
    if (!event.isPublic && event.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un événement
exports.createEvent = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Administrateur seulement' });
  
  try {
    const { title, description, date, location, maxParticipants, status, isPublic, categoryId } = req.body;
    
    if (!title || !date || !location || !maxParticipants) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    
    const event = await Event.create({
      title,
      description,
      date,
      location,
      maxParticipants,
      status: status || 'scheduled',
      isPublic: isPublic !== undefined ? isPublic : true,
      categoryId,
      createdBy: req.user.id
    });
    
    const eventWithDetails = await Event.findByPk(event.id, {
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'creator', attributes: ['id', 'email'] }
      ]
    });
    
    res.status(201).json(eventWithDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mettre à jour un événement
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) return res.status(404).json({ error: 'Événement non trouvé' });
    
    // Vérifier les permissions : owner ou admin
    if (event.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Vous ne pouvez modifier que vos événements' });
    }
    
    await event.update(req.body);
    
    const updatedEvent = await Event.findByPk(event.id, {
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'creator', attributes: ['id', 'email'] }
      ]
    });
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un événement
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) return res.status(404).json({ error: 'Événement non trouvé' });
    
    // Vérifier les permissions : owner ou admin
    if (event.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Vous ne pouvez supprimer que vos événements' });
    }
    
    await event.destroy();
    res.json({ message: 'Événement supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
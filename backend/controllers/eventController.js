const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    await event.update(req.body);
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    await event.destroy();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
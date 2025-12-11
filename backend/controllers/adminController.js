const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.getStats = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Administrateur seulement' });
  try {
    const userCount = await User.count();
    const eventCount = await Event.count();
    const registrationCount = await Registration.count();
    res.json({ userCount, eventCount, registrationCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
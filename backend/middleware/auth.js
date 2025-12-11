const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware d'authentification
 * Vérifie le token JWT et attache l'utilisateur à req.user
 */
const authenticate = async (req, res, next) => {
  try {
    // Extraire le token du header Authorization
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token invalide' });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    // Attacher l'utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }
    res.status(401).json({ error: 'Authentification échouée' });
  }
};

/**
 * Middleware pour vérifier que l'utilisateur est admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Droits administrateur requis' });
  }

  next();
};

module.exports = authenticate;
module.exports.requireAdmin = requireAdmin;
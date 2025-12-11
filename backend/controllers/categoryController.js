const { Category } = require('../models');

// Récupérer toutes les catégories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer une catégorie spécifique
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Catégorie non trouvée' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer une catégorie (admin only)
exports.createCategory = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrateur seulement' });
  }
  
  try {
    const { name, description, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }
    
    const category = await Category.create({
      name,
      description,
      color: color || '#007bff'
    });
    
    res.status(201).json(category);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Cette catégorie existe déjà' });
    }
    res.status(400).json({ error: error.message });
  }
};

// Mettre à jour une catégorie (admin only)
exports.updateCategory = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrateur seulement' });
  }
  
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Catégorie non trouvée' });
    
    await category.update(req.body);
    res.json(category);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Cette catégorie existe déjà' });
    }
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une catégorie (admin only)
exports.deleteCategory = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrateur seulement' });
  }
  
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Catégorie non trouvée' });
    
    await category.destroy();
    res.json({ message: 'Catégorie supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Toutes les catégories sont accessibles en lecture (pas d'authentification requise)
router.get('/', getCategories);
router.get('/:id', getCategory);

// Les modifications nécessitent une authentification (et admin check dans le contrôleur)
router.post('/', authenticate, createCategory);
router.put('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

module.exports = router;

const express = require('express');
const router = express.Router();
const dictCtrl = require('../controllers/dictionary.controller');

// Public endpoints
router.get('/', dictCtrl.getAll); // List all words
router.get('/:word', dictCtrl.getByWord); // Get by word

// Admin endpoints (should be protected in real app)
router.post('/', dictCtrl.create); // Add new word
router.put('/:word', dictCtrl.update); // Update definition
router.delete('/:word', dictCtrl.remove); // Delete word

module.exports = router;

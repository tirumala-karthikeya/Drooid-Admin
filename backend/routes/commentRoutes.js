const express = require('express');
const router = express.Router();
const { getAllComments, deleteComment } = require('../controllers/commentController');

// Get all comments
router.get('/', getAllComments);

// Delete a comment
router.delete('/:id', deleteComment);

module.exports = router; 
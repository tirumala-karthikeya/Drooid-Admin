const express = require('express');
const router = express.Router();
const { getAllPosts, deletePost } = require('../controllers/postController');

// Get all posts with search functionality
router.get('/', getAllPosts);

// Delete a post
router.delete('/:id', deletePost);

module.exports = router; 
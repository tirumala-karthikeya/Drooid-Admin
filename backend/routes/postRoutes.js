const express = require('express');
const router = express.Router();
const { getAllPosts, deletePost, searchPosts } = require('../controllers/postController');

// Get all posts with search functionality
router.get('/', getAllPosts);

// Search posts
router.get('/search', searchPosts);

// Delete a post
router.delete('/:id', deletePost);

module.exports = router; 
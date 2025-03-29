import express from 'express';
import { getStats } from '../controllers/statsController';
import { getComments, deleteComment } from '../controllers/commentsController';
import { searchPosts, deletePost } from '../controllers/postsController';

const router = express.Router();

// Stats routes
router.get('/stats', getStats);

// Comments routes
router.get('/comments', getComments);
router.delete('/comments/:id', deleteComment);

// Posts routes
router.get('/posts/search', searchPosts);
router.delete('/posts/:id', deletePost);

export default router; 
const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.get('/', forumController.getAllPosts);
router.post('/', forumController.createPost);
router.delete('/:id', forumController.deletePost);
router.post('/:id/comment', forumController.addComment);
router.delete('/:id/comment/:commentId', forumController.deleteComment);

module.exports = router;
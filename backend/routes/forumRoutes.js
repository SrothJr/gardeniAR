// // backend/routes/forumRoutes.js
// const express = require('express');
// const router = express.Router();
// const forumController = require('../controllers/forumController');

// router.get('/', forumController.getAllPosts);
// router.post('/', forumController.createPost);
// router.delete('/:id', forumController.deletePost);
// router.post('/:id/comment', forumController.addComment);
// router.delete('/:id/comment/:commentId', forumController.deleteComment);

// module.exports = router;


// backend/routes/forumRoutes.js
const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

// Posts
router.get('/', forumController.getAllPosts);
router.get('/:id', forumController.getPostById);
router.post('/', forumController.createPost);
router.put('/:id', forumController.editPost);
router.delete('/:id', forumController.deletePost);

// Post voting & saving
router.post('/:id/vote', forumController.votePost);
router.post('/:id/save', forumController.savePost);

// Comments
router.post('/:id/comment', forumController.addComment);
router.delete('/:id/comment/:commentId', forumController.deleteComment);
router.post('/:id/comment/:commentId/vote', forumController.voteComment);

// Replies
router.post('/:id/comment/:commentId/reply', forumController.addReply);

module.exports = router;
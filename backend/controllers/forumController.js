// // backend/controllers/forumController.js
// const ForumPost = require('../models/forumPostModel');

// // Get all posts (newest first)
// exports.getAllPosts = async (req, res) => {
//   try {
//     const posts = await ForumPost.find()
//       .populate('author', 'name location') 
//       .populate('comments.author', 'name')
//       .sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create a new post
// exports.createPost = async (req, res) => {
//   try {
//     const { title, content, authorId } = req.body;
//     const newPost = new ForumPost({
//       title,
//       content,
//       author: authorId
//     });
//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a post
// exports.deletePost = async (req, res) => {
//   try {
//     const post = await ForumPost.findByIdAndDelete(req.params.id);
//     if (!post) return res.status(404).json({ message: 'Post not found' });
//     res.json({ message: 'Post deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Add a comment
// exports.addComment = async (req, res) => {
//   try {
//     const { text, authorId } = req.body;
//     const post = await ForumPost.findById(req.params.id);
//     if (!post) return res.status(404).json({ message: 'Post not found' });

//     post.comments.push({ text, author: authorId });
//     await post.save();
//     res.json(post);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a comment
// exports.deleteComment = async (req, res) => {
//   try {
//     const { id, commentId } = req.params;
//     const post = await ForumPost.findById(id);
//     if (!post) return res.status(404).json({ message: 'Post not found' });

//     // Filter out the comment
//     post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    
//     await post.save();
//     res.json(post);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// backend/controllers/forumController.js
const ForumPost = require('../models/forumPostModel');
const User = require('../models/userModel');

// ─── Helpers ────────────────────────────────────────────────────────────────

async function recalcKarma(userId) {
  const posts = await ForumPost.find({ author: userId });
  let karma = 0;
  posts.forEach(post => {
    karma += post.upvotes.length - post.downvotes.length;
    post.comments.forEach(c => {
      if (c.author.toString() === userId.toString()) {
        karma += c.upvotes.length - c.downvotes.length;
      }
    });
  });
  await User.findByIdAndUpdate(userId, { karma });
}

async function sendNotification(toUserId, fromUserId, type, postId, message) {
  if (toUserId.toString() === fromUserId.toString()) return; // don't notify yourself
  await User.findByIdAndUpdate(toUserId, {
    $push: {
      notifications: { message, type, postId, fromUser: fromUserId, read: false, createdAt: new Date() }
    }
  });
}

// ─── Posts ───────────────────────────────────────────────────────────────────

// GET /api/forum?sort=new|top|upvoted
exports.getAllPosts = async (req, res) => {
  try {
    const { sort } = req.query;
    let posts = await ForumPost.find()
      .populate('author', 'name location profilePicture')
      .populate('comments.author', 'name profilePicture')
      .populate('comments.replies.author', 'name profilePicture');

    if (sort === 'top') {
      posts.sort((a, b) => (b.upvotes.length - b.downvotes.length) - (a.upvotes.length - a.downvotes.length));
    } else if (sort === 'upvoted') {
      posts.sort((a, b) => b.upvotes.length - a.upvotes.length);
    } else {
      // default: new
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/forum/:id
exports.getPostById = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name location profilePicture')
      .populate('comments.author', 'name profilePicture')
      .populate('comments.replies.author', 'name profilePicture');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/forum
exports.createPost = async (req, res) => {
  try {
    const { title, content, authorId, images } = req.body;
    const newPost = new ForumPost({
      title,
      content,
      author: authorId,
      images: images || []
    });
    await newPost.save();
    const populated = await newPost.populate('author', 'name location profilePicture');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/forum/:id
exports.editPost = async (req, res) => {
  try {
    const { title, content, images, userId } = req.body;
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== userId) return res.status(403).json({ message: 'Unauthorized' });

    post.title = title || post.title;
    post.content = content || post.content;
    if (images) post.images = images;
    post.updatedAt = new Date();
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/forum/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Voting ───────────────────────────────────────────────────────────────────

// POST /api/forum/:id/vote  { userId, vote: 'up'|'down' }
exports.votePost = async (req, res) => {
  try {
    const { userId, vote } = req.body;
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const upIdx = post.upvotes.indexOf(userId);
    const downIdx = post.downvotes.indexOf(userId);

    if (vote === 'up') {
      if (upIdx > -1) {
        post.upvotes.splice(upIdx, 1); // toggle off
      } else {
        post.upvotes.push(userId);
        if (downIdx > -1) post.downvotes.splice(downIdx, 1);
        await sendNotification(post.author, userId, 'upvote_post', post._id, 'Someone upvoted your post!');
      }
    } else if (vote === 'down') {
      if (downIdx > -1) {
        post.downvotes.splice(downIdx, 1); // toggle off
      } else {
        post.downvotes.push(userId);
        if (upIdx > -1) post.upvotes.splice(upIdx, 1);
      }
    }

    await post.save();
    await recalcKarma(post.author);
    res.json({ upvotes: post.upvotes, downvotes: post.downvotes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── Save ─────────────────────────────────────────────────────────────────────

// POST /api/forum/:id/save  { userId }
exports.savePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const idx = post.savedBy.indexOf(userId);
    if (idx > -1) {
      post.savedBy.splice(idx, 1);
    } else {
      post.savedBy.push(userId);
    }
    await post.save();
    res.json({ saved: idx === -1, savedBy: post.savedBy });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── Comments ─────────────────────────────────────────────────────────────────

// POST /api/forum/:id/comment
exports.addComment = async (req, res) => {
  try {
    const { text, authorId } = req.body;
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ text, author: authorId });
    await post.save();

    await sendNotification(post.author, authorId, 'reply_post', post._id, 'Someone commented on your post!');

    const populated = await ForumPost.findById(post._id)
      .populate('author', 'name profilePicture')
      .populate('comments.author', 'name profilePicture')
      .populate('comments.replies.author', 'name profilePicture');
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/forum/:id/comment/:commentId
exports.deleteComment = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST /api/forum/:id/comment/:commentId/vote  { userId, vote: 'up'|'down' }
exports.voteComment = async (req, res) => {
  try {
    const { userId, vote } = req.body;
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const upIdx = comment.upvotes.indexOf(userId);
    const downIdx = comment.downvotes.indexOf(userId);

    if (vote === 'up') {
      if (upIdx > -1) {
        comment.upvotes.splice(upIdx, 1);
      } else {
        comment.upvotes.push(userId);
        if (downIdx > -1) comment.downvotes.splice(downIdx, 1);
        await sendNotification(comment.author, userId, 'upvote_comment', post._id, 'Someone upvoted your comment!');
      }
    } else if (vote === 'down') {
      if (downIdx > -1) {
        comment.downvotes.splice(downIdx, 1);
      } else {
        comment.downvotes.push(userId);
        if (upIdx > -1) comment.upvotes.splice(upIdx, 1);
      }
    }

    await post.save();
    await recalcKarma(comment.author);
    res.json({ upvotes: comment.upvotes, downvotes: comment.downvotes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── Replies ──────────────────────────────────────────────────────────────────

// POST /api/forum/:id/comment/:commentId/reply  { text, authorId }
exports.addReply = async (req, res) => {
  try {
    const { text, authorId } = req.body;
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    comment.replies.push({ text, author: authorId });
    await post.save();

    await sendNotification(comment.author, authorId, 'reply_comment', post._id, 'Someone replied to your comment!');

    const populated = await ForumPost.findById(post._id)
      .populate('author', 'name profilePicture')
      .populate('comments.author', 'name profilePicture')
      .populate('comments.replies.author', 'name profilePicture');
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
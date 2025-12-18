const ForumPost = require('../models/forumPostModel');

// Get all posts (newest first)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate('author', 'name location') 
      .populate('comments.author', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    const newPost = new ForumPost({
      title,
      content,
      author: authorId
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { text, authorId } = req.body;
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ text, author: authorId });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const post = await ForumPost.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Filter out the comment
    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
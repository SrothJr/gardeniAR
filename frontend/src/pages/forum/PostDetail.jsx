import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, ChevronUp, ChevronDown, MessageSquare, 
  Clock, Send, MoreVertical, Flag, Edit, Trash,
  Loader2, AlertTriangle, Bookmark, Share2, ThumbsUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/forum/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Fetch post failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const handleVote = async (vote) => {
    if (!user) { navigate('/login'); return; }
    try {
      const res = await axios.post(`${BACKEND_URL}/api/forum/${id}/vote`, { 
        userId: user._id, 
        vote 
      });
      setPost({ ...post, ...res.data });
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/forum/${id}/comment`, {
        userId: user._id,
        content: commentText
      });
      setPost(res.data);
      setCommentText('');
    } catch (err) {
      console.error("Comment failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-primary w-12 h-12" />
      <p className="text-muted-foreground">Loading discussion...</p>
    </div>
  );

  if (!post) return (
    <div className="text-center py-20">
      <AlertTriangle size={48} className="mx-auto text-destructive mb-4" />
      <h2 className="text-2xl font-bold">Discussion not found</h2>
      <button onClick={() => navigate('/forum')} className="text-primary mt-4 font-bold hover:underline">Back to Forum</button>
    </div>
  );

  const score = (post.upvotes?.length || 0) - (post.downvotes?.length || 0);
  const userVotedUp = user && post.upvotes?.includes(user._id);
  const userVotedDown = user && post.downvotes?.includes(user._id);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate('/forum')}
        className="flex items-center gap-2 text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-xl transition-all w-fit"
      >
        <ArrowLeft size={20} />
        <span>Back to Forum</span>
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Vote Sidebar (Desktop) */}
        <div className="hidden md:flex flex-col items-center gap-2">
          <button 
            onClick={() => handleVote(1)}
            className={`p-2 rounded-xl transition-all ${userVotedUp ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-surface border border-border text-muted-foreground hover:border-primary/50 hover:text-primary'}`}
          >
            <ChevronUp size={28} />
          </button>
          <span className="text-xl font-bold">{score}</span>
          <button 
            onClick={() => handleVote(-1)}
            className={`p-2 rounded-xl transition-all ${userVotedDown ? 'bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20' : 'bg-surface border border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive'}`}
          >
            <ChevronDown size={28} />
          </button>
        </div>

        {/* Post Content */}
        <div className="flex-1 space-y-8">
          <article className="bg-surface border border-border rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {post.author?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-bold">{post.author?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> {getTimeAgo(post.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-all">
                  <Bookmark size={20} />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-all">
                  <Share2 size={20} />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full border border-secondary/20 uppercase">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
                {post.content}
              </p>
            </div>

            {post.image && (
              <div className="rounded-3xl overflow-hidden bg-muted/20 border border-border">
                <img src={post.image} alt={post.title} className="w-full h-full object-contain max-h-[600px]" />
              </div>
            )}
            
            {/* Mobile Vote Controls */}
            <div className="flex md:hidden items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-4 bg-muted/30 p-1 rounded-2xl border border-border">
                    <button 
                        onClick={() => handleVote(1)}
                        className={`p-2 rounded-xl ${userVotedUp ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                    >
                        <ChevronUp size={24} />
                    </button>
                    <span className="font-bold">{score}</span>
                    <button 
                        onClick={() => handleVote(-1)}
                        className={`p-2 rounded-xl ${userVotedDown ? 'bg-destructive text-destructive-foreground' : 'text-muted-foreground'}`}
                    >
                        <ChevronDown size={24} />
                    </button>
                </div>
            </div>
          </article>

          {/* Comments Section */}
          <section className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <MessageSquare size={24} className="text-primary" />
              Comments ({post.comments?.length || 0})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleComment} className="bg-surface border border-border rounded-3xl p-4 flex flex-col gap-4">
              <textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={user ? "Share your thoughts..." : "Please log in to comment"}
                disabled={!user || submitting}
                rows={3}
                className="w-full bg-background border border-border rounded-2xl p-4 outline-none focus:border-primary transition-all resize-none disabled:opacity-50"
              />
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={!user || submitting || !commentText.trim()}
                  className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Post Comment</>}
                </button>
              </div>
            </form>

            {/* Comment List */}
            <div className="space-y-4">
              {post.comments?.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No comments yet. Start the discussion!
                </div>
              ) : (
                post.comments.map((comment) => (
                  <div key={comment._id} className="bg-surface/50 border border-border rounded-2xl p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">
                          {comment.author?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-bold text-sm">{comment.author?.name || 'User'}</span>
                        <span className="text-xs text-muted-foreground">• {getTimeAgo(comment.createdAt)}</span>
                      </div>
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <button className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        <ThumbsUp size={14} /> Helpfull
                      </button>
                      <button className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

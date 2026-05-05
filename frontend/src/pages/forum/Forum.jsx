import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { 
  MessageCircle, ThumbsUp, ThumbsDown, 
  Bookmark, Share2, Plus, Search, 
  MessageSquare, Clock, User, Filter,
  ChevronUp, ChevronDown, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('New');
  const navigate = useNavigate();

  const fetchPosts = async (sortMode = sort) => {
    setLoading(true);
    try {
      const sortParam = sortMode.toLowerCase();
      const response = await axios.get(`${BACKEND_URL}/api/forum?sort=${sortParam}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Fetch posts error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sort]);

  const handleVote = async (postId, vote, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.post(`${BACKEND_URL}/api/forum/${postId}/vote`, { 
        userId: user._id, 
        vote 
      });
      const { upvotes, downvotes } = res.data;
      setPosts(prev => prev.map(p =>
        p._id === postId ? { ...p, upvotes, downvotes } : p
      ));
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const handleSave = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.post(`${BACKEND_URL}/api/forum/${postId}/save`, { 
        userId: user._id 
      });
      const { savedBy } = res.data;
      setPosts(prev => prev.map(p =>
        p._id === postId ? { ...p, savedBy } : p
      ));
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground mt-1">Ask questions and share your garden journey</p>
        </div>
        <button 
          onClick={() => user ? navigate('/forum/create') : navigate('/login')}
          className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          <span>New Post</span>
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input 
            type="text"
            placeholder="Search discussions..."
            className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
          />
        </div>
        <div className="flex items-center bg-surface border border-border rounded-2xl p-1 shrink-0">
          {['New', 'Top', 'Hot'].map((mode) => (
            <button
              key={mode}
              onClick={() => setSort(mode)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                sort === mode 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary w-12 h-12" />
            <p className="text-muted-foreground">Loading discussions...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border rounded-3xl">
            <MessageSquare size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-bold">No posts yet</h3>
            <p className="text-muted-foreground mt-1">Be the first to start a conversation!</p>
          </div>
        ) : (
          posts.map((post) => {
            const score = (post.upvotes?.length || 0) - (post.downvotes?.length || 0);
            const userVotedUp = user && post.upvotes?.includes(user._id);
            const userVotedDown = user && post.downvotes?.includes(user._id);
            const isSaved = user && post.savedBy?.includes(user._id);

            return (
              <motion.div 
                key={post._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-border rounded-3xl overflow-hidden hover:border-primary/30 transition-all group"
              >
                <Link to={`/forum/${post._id}`} className="flex flex-col md:flex-row">
                  {/* Vote Sidebar (Desktop) */}
                  <div className="hidden md:flex flex-col items-center gap-1 p-4 bg-muted/20 border-r border-border min-w-[64px]">
                    <button 
                      onClick={(e) => handleVote(post._id, 1, e)}
                      className={`p-1 rounded-lg transition-colors ${userVotedUp ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
                    >
                      <ChevronUp size={24} />
                    </button>
                    <span className={`font-bold ${score > 0 ? 'text-primary' : score < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {score}
                    </span>
                    <button 
                      onClick={(e) => handleVote(post._id, -1, e)}
                      className={`p-1 rounded-lg transition-colors ${userVotedDown ? 'text-destructive bg-destructive/10' : 'text-muted-foreground hover:text-destructive hover:bg-destructive/5'}`}
                    >
                      <ChevronDown size={24} />
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 p-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {post.author?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-bold text-foreground">{post.author?.name || 'User'}</span>
                        <span>•</span>
                        <Clock size={12} />
                        <span>{getTimeAgo(post.createdAt)}</span>
                      </div>
                      {post.tags?.[0] && (
                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full uppercase border border-secondary/20">
                          {post.tags[0]}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-bold group-hover:text-primary transition-colors">{post.title}</h2>
                      <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {post.image && (
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-muted/20 border border-border">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MessageSquare size={18} />
                          <span className="text-sm font-bold">{post.comments?.length || 0}</span>
                        </div>
                        <button 
                          onClick={(e) => handleSave(post._id, e)}
                          className={`flex items-center gap-2 transition-colors ${isSaved ? 'text-accent' : 'text-muted-foreground hover:text-accent'}`}
                        >
                          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                          <span className="text-sm font-bold">{isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors"
                        >
                          <Share2 size={18} />
                          <span className="text-sm font-bold">Share</span>
                        </button>
                      </div>
                      
                      {/* Mobile Vote Controls */}
                      <div className="flex md:hidden items-center gap-3 bg-muted/30 px-3 py-1 rounded-full border border-border">
                        <button 
                          onClick={(e) => handleVote(post._id, 1, e)}
                          className={userVotedUp ? 'text-primary' : 'text-muted-foreground'}
                        >
                          <ChevronUp size={20} />
                        </button>
                        <span className="text-xs font-bold">{score}</span>
                        <button 
                          onClick={(e) => handleVote(post._id, -1, e)}
                          className={userVotedDown ? 'text-destructive' : 'text-muted-foreground'}
                        >
                          <ChevronDown size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Forum;

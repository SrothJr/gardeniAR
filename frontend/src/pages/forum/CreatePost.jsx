import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, Image as ImageIcon, X, 
  Send, Loader2, AlertTriangle, Info,
  Tag as TagIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

const PREDEFINED_TAGS = ["General", "Question", "Showcase", "Help", "Diseases", "Tips", "Seasonal"];

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await axios.post(`${BACKEND_URL}/api/forum`, {
        userId: user._id,
        title,
        content,
        tags: selectedTags,
        image: image || null
      });
      navigate(`/forum/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
      console.error("Create post failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate('/forum')}
        className="flex items-center gap-2 text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-xl transition-all w-fit"
      >
        <ArrowLeft size={20} />
        <span>Cancel</span>
      </button>

      <header>
        <h1 className="text-3xl font-bold">Start a Discussion</h1>
        <p className="text-muted-foreground mt-1">Share your knowledge or ask the community for help</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface border border-border rounded-3xl p-6 md:p-8">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-medium flex items-center gap-3">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Title</label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-xl font-bold outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2">
            <TagIcon size={14} /> Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  selectedTags.includes(tag) 
                    ? 'bg-secondary border-secondary text-secondary-foreground' 
                    : 'bg-background border-border text-muted-foreground hover:border-muted'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Content</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share the details..."
            rows={8}
            className="w-full bg-background border border-border rounded-2xl p-6 outline-none focus:border-primary transition-all resize-none leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Image URL (Optional)</label>
          <div className="relative">
            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 flex items-start gap-3">
          <Info size={18} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please be respectful and helpful to other community members. Avoid spamming and follow the community guidelines.
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={submitting || !title.trim() || !content.trim()}
            className="bg-primary text-primary-foreground font-bold px-12 py-4 rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Post Discussion</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

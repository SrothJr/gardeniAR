import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { 
  User, Mail, MapPin, Calendar, 
  MessageSquare, Heart, Bookmark,
  Edit, Camera, LogOut, Loader2,
  ChevronRight, Settings, Bell,
  TrendingUp, Award, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    bio: '',
    profilePicture: ''
  });

  const [activity, setActivity] = useState({
    posts: [],
    comments: [],
    savedPosts: []
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      name: user.name || '',
      city: user.location?.city || '',
      bio: user.bio || '',
      profilePicture: user.profilePicture || ''
    });

    loadActivity();
  }, [user]);

  const loadActivity = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/users/profile/${user._id}`);
      setActivity({
        posts: res.data.posts || [],
        comments: res.data.comments || [],
        savedPosts: res.data.savedPosts || []
      });
    } catch (err) {
      console.error('Error loading profile activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateUser({
      name: formData.name,
      location: { city: formData.city },
      bio: formData.bio,
      profilePicture: formData.profilePicture
    });
    
    if (result.success) {
      setIsEditing(false);
    } else {
      alert(result.message || 'Update failed');
    }
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 md:px-0">
      {/* Header / Cover */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-surface to-secondary/10 border border-border overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-grid-white/5 opacity-20" />
        
        {/* Information inside banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-t from-background/90 via-background/40 to-transparent">
          <div className="relative group shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-surface border-4 border-background overflow-hidden shadow-2xl relative z-10">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-primary bg-primary/10">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-2 right-2 p-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg hover:scale-110 transition-transform z-20 border-2 border-background">
                <Camera size={18} />
              </button>
            )}
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 w-full text-center md:text-left">
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{user.name}</h1>
                {user.isPremium && (
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-bold border border-accent/20 flex items-center gap-1 uppercase tracking-wider">
                    <Award size={12} /> Premium
                  </span>
                )}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs text-muted-foreground font-semibold">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface/40 rounded-xl border border-border/30 backdrop-blur-md">
                  <MapPin size={12} className="text-primary" /> {user.location?.city || 'Add Location'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface/40 rounded-xl border border-border/30 backdrop-blur-md">
                  <Mail size={12} className="text-primary" /> {user.email}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface/40 rounded-xl border border-border/30 backdrop-blur-md">
                  <TrendingUp size={12} className="text-primary" /> {user.karma || 0} Karma
                </span>
              </div>
            </div>

            <div className="flex justify-center items-center gap-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg text-sm ${
                  isEditing 
                    ? 'bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20' 
                    : 'bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20'
                }`}
              >
                {isEditing ? <X size={16} /> : <Edit size={16} />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button 
                onClick={() => { logout(); navigate('/login'); }}
                className="p-3 rounded-2xl bg-surface/40 border border-border/30 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shadow-lg backdrop-blur-md"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Left: Bio & Stats */}
        <div className="space-y-6">
            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.form 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleUpdate}
                        className="p-6 bg-surface border border-border rounded-3xl space-y-4"
                    >
                        <h3 className="font-bold text-lg mb-2">Update Info</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-background border border-border rounded-xl p-3 outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">City</label>
                                <input 
                                    type="text" 
                                    value={formData.city}
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    className="w-full bg-background border border-border rounded-xl p-3 outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Bio</label>
                                <textarea 
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    rows={4}
                                    className="w-full bg-background border border-border rounded-xl p-3 outline-none focus:border-primary resize-none"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={saving}
                                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
                            </button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-surface border border-border rounded-3xl space-y-4"
                    >
                        <h3 className="font-bold text-lg">About Me</h3>
                        <p className="text-muted-foreground leading-relaxed italic">
                            {user.bio || "No bio added yet. Tell the community about your gardening journey!"}
                        </p>
                        <div className="pt-4 border-t border-border flex items-center justify-between">
                            <span className="text-sm font-bold text-muted-foreground">Joined</span>
                            <span className="text-sm font-bold">{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-6 bg-surface border border-border rounded-3xl space-y-6">
                <h3 className="font-bold text-lg">Garden Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                        <p className="text-2xl font-bold text-primary">{activity.posts.length}</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase mt-1">Posts</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/10 text-center">
                        <p className="text-2xl font-bold text-secondary">{activity.comments.length}</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase mt-1">Comments</p>
                    </div>
                </div>
                {!user.isPremium && (
                    <button 
                        onClick={() => navigate('/premium')}
                        className="w-full p-4 rounded-2xl bg-accent/10 text-accent border border-accent/20 font-bold text-sm flex items-center justify-center gap-2 hover:bg-accent/20 transition-all"
                    >
                        <Award size={18} /> Upgrade to Premium
                    </button>
                )}
            </div>
        </div>

        {/* Right: Activity Tabs */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex bg-surface border border-border rounded-2xl p-1 shrink-0">
                {[
                    { id: 'posts', label: 'My Posts', icon: MessageSquare },
                    { id: 'comments', label: 'Comments', icon: Edit },
                    { id: 'saved', label: 'Saved', icon: Bookmark }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeTab === tab.id 
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" 
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <tab.icon size={16} />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-primary w-10 h-10" />
                        <p className="text-muted-foreground">Loading activity...</p>
                    </div>
                ) : activity[activeTab === 'posts' ? 'posts' : activeTab === 'comments' ? 'comments' : 'savedPosts'].length === 0 ? (
                    <div className="text-center py-20 bg-surface border border-border rounded-3xl space-y-4">
                        <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto text-muted-foreground opacity-20 text-2xl">
                            🍃
                        </div>
                        <p className="text-muted-foreground">No {activeTab} yet.</p>
                    </div>
                ) : (
                    activity[activeTab === 'posts' ? 'posts' : activeTab === 'comments' ? 'comments' : 'savedPosts'].map((item, idx) => (
                        <motion.div 
                            key={item._id || idx}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 bg-surface border border-border rounded-3xl hover:border-primary/30 transition-all cursor-pointer group"
                            onClick={() => item.title && navigate(`/forum/${item._id}`)}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2 flex-1">
                                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{item.title || item.content}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                        {item.upvotes && (
                                            <span className="text-xs font-bold text-primary">
                                                {item.upvotes.length - (item.downvotes?.length || 0)} Points
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

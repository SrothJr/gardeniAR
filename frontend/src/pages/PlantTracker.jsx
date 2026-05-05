import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { 
  Plus, Calendar, Trash2, Clock, 
  ChevronRight, Sparkles, Bug, Leaf,
  Loader2, AlertCircle, Info, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PlantTracker = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    plantingDate: '',
    harvestingDate: ''
  });

  const fetchPlants = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/plants`);
      // Filtering for tracked plants (assuming they have a plantingDate in this context)
      // Actually, mobile app uses a different endpoint for tracked plants? 
      // Looking at mobile code, it uses /api/plants for tracking too.
      setPlants(res.data.filter(p => p.plantingDate));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/plants`, formData);
      setFormData({ name: '', plantingDate: '', harvestingDate: '' });
      setShowAddForm(false);
      fetchPlants();
    } catch (err) {
      console.error(err);
    }
  };

  const calculateProgress = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    const total = endDate - startDate;
    const current = today - startDate;
    const progress = Math.min(100, Math.max(0, (current / total) * 100));
    return progress.toFixed(0);
  };

  const getRemainingDays = (end) => {
    const today = new Date();
    const endDate = new Date(end);
    const diff = endDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Plant Tracker</h1>
          <p className="text-muted-foreground mt-1">Monitor your garden's growth and harvest cycle</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          <span>Track New Plant</span>
        </button>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link 
            to="/crop-suggestions"
            className="p-6 bg-secondary/10 border border-secondary/20 rounded-3xl flex items-center justify-between group hover:bg-secondary/15 transition-all"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h3 className="font-bold">Crop Suggestions</h3>
                    <p className="text-xs text-muted-foreground">AI recommendations for your space</p>
                </div>
            </div>
            <ChevronRight className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link 
            to="/disease-detection"
            className="p-6 bg-destructive/10 border border-destructive/20 rounded-3xl flex items-center justify-between group hover:bg-destructive/15 transition-all"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-destructive/20 rounded-2xl flex items-center justify-center text-destructive">
                    <Bug size={24} />
                </div>
                <div>
                    <h3 className="font-bold">Disease Detection</h3>
                    <p className="text-xs text-muted-foreground">Identify and treat plant issues</p>
                </div>
            </div>
            <ChevronRight className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAdd}
            className="bg-surface border border-border rounded-3xl p-6 md:p-8 space-y-6 overflow-hidden shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Plant Name</label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all"
                  placeholder="e.g., Tomato"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Planting Date</label>
                <input 
                  required
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) => setFormData({...formData, plantingDate: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Expected Harvest</label>
                <input 
                  required
                  type="date"
                  value={formData.harvestingDate}
                  onChange={(e) => setFormData({...formData, harvestingDate: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-2">
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 rounded-xl text-muted-foreground font-bold hover:text-foreground transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all"
              >
                Start Tracking
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary w-12 h-12" />
            <p className="text-muted-foreground">Loading your plants...</p>
          </div>
        ) : plants.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border rounded-3xl space-y-4">
            <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto text-4xl opacity-20">🌱</div>
            <div>
                <h3 className="text-xl font-bold">No plants tracked yet</h3>
                <p className="text-muted-foreground">Start tracking your garden to see growth progress.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plants.map((plant) => {
              const progress = calculateProgress(plant.plantingDate, plant.harvestingDate);
              const remaining = getRemainingDays(plant.harvestingDate);
              
              return (
                <motion.div 
                  key={plant._id}
                  layout
                  className="bg-surface border border-border rounded-3xl p-6 space-y-6 group hover:border-primary/30 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <Leaf size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{plant.name}</h3>
                            <p className="text-xs text-muted-foreground">Started {new Date(plant.plantingDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase ${remaining <= 0 ? 'bg-primary/20 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                        {remaining <= 0 ? 'Ready to Harvest' : `${remaining} Days Left`}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                        <span className="text-muted-foreground">Growth Progress</span>
                        <span className="text-primary">{progress}%</span>
                    </div>
                    <div className="h-3 bg-muted/20 rounded-full overflow-hidden border border-border/50 p-0.5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-muted/10 border border-border/50 flex flex-col items-center text-center">
                        <Calendar size={18} className="text-secondary mb-2" />
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Harvest Date</span>
                        <span className="text-sm font-bold mt-1">{new Date(plant.harvestingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/10 border border-border/50 flex flex-col items-center text-center">
                        <TrendingUp size={18} className="text-accent mb-2" />
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Growth Rate</span>
                        <span className="text-sm font-bold mt-1">Normal</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-8 bg-surface border border-border rounded-3xl flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-primary bg-primary/10 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">
                <Sparkles size={14} /> Coming Soon
            </div>
            <h3 className="text-2xl font-bold">Immersive AR Experience</h3>
            <p className="text-muted-foreground leading-relaxed">
                We're bringing high-fidelity 3D plant tracking to the web! Soon you'll be able to visualize your garden's future state right in your browser using WebXR.
            </p>
        </div>
        <div className="w-full md:w-1/3 aspect-square bg-muted/20 rounded-[2rem] border border-dashed border-border flex items-center justify-center text-muted-foreground text-center p-6">
            <p className="text-sm font-bold opacity-50 italic">AR Preview Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default PlantTracker;

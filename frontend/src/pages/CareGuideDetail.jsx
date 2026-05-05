import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { 
  ArrowLeft, Droplets, Sun, Thermometer, 
  Calendar, Info, Sparkles, Loader2, 
  CheckCircle2, Plus, ShoppingCart, 
  ChevronRight, Heart, Share2, AlertTriangle,
  BookOpen, Sprout, Wind, Beaker
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = ["Seedling", "Vegetative", "Flowering", "Fruiting"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter", "All Year"];

const CareGuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState("Vegetative");
  const [activeSeason, setActiveSeason] = useState("Summer");

  useEffect(() => {
    const fetchGuide = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/care-guide/${id}`);
        setGuide(res.data.guide || res.data);
      } catch (err) {
        console.error("Fetch guide error", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchGuide();
  }, [id]);

  const getRule = (list) => {
    if (!list || list.length === 0) return null;
    const has = (r, season) => Array.isArray(r.season) ? r.season.includes(season) : r.season === season;
    return (
      list.find((r) => r.lifeStage === activeStage && has(r, activeSeason)) ||
      list.find((r) => r.lifeStage === activeStage && has(r, "All Year")) ||
      list.find((r) => r.lifeStage === "General" && has(r, activeSeason)) ||
      list.find((r) => r.lifeStage === "General" && has(r, "All Year")) ||
      null
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-primary w-12 h-12" />
      <p className="text-muted-foreground">Loading care instructions...</p>
    </div>
  );

  if (!guide) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Guide not found</h2>
      <button onClick={() => navigate('/care-guides')} className="text-primary mt-4 font-bold hover:underline">Back to Guides</button>
    </div>
  );

  const waterRule = getRule(guide.waterConfig);
  const fertRule = getRule(guide.fertilizerConfig);
  const heroImage = guide.stageImages?.[activeStage.toLowerCase()] || guide.image || "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate('/care-guides')}
        className="flex items-center gap-2 text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-xl transition-all w-fit"
      >
        <ArrowLeft size={20} />
        <span>Back to Guides</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <motion.div 
            layoutId="guide-hero"
            className="aspect-square rounded-3xl overflow-hidden bg-surface border border-border"
          >
            <img src={heroImage} alt={guide.name} className="w-full h-full object-cover" />
          </motion.div>
          
          <div className="p-6 bg-surface border border-border rounded-3xl space-y-4">
             <h3 className="text-xl font-bold flex items-center gap-2">
                <Info size={20} className="text-primary" />
                About {guide.name}
             </h3>
             <p className="text-muted-foreground leading-relaxed">
                {guide.description || "Comprehensive care guide for maintaining healthy plant growth."}
             </p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{guide.name} Care Tracker</h1>
            <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20 flex items-center gap-2">
                    <Sprout size={16} /> {guide.type || 'Plant'}
                </span>
                <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-bold border border-secondary/20 flex items-center gap-2">
                    <Wind size={16} /> {guide.sunlight || 'N/A'}
                </span>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-3xl p-8 space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calendar size={24} className="text-primary" />
                Select Conditions
              </h3>
              
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Life Stage</p>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map(stage => (
                    <button 
                      key={stage}
                      onClick={() => setActiveStage(stage)}
                      className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all ${
                        activeStage === stage ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-background border-border text-muted-foreground hover:border-muted'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Season</p>
                <div className="flex flex-wrap gap-2">
                  {SEASONS.map(season => (
                    <button 
                      key={season}
                      onClick={() => setActiveSeason(season)}
                      className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all ${
                        activeSeason === season ? 'bg-secondary border-secondary text-secondary-foreground shadow-lg shadow-secondary/20' : 'bg-background border-border text-muted-foreground hover:border-muted'
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-secondary font-bold">
                    <Droplets size={20} />
                    <h4>Watering Schedule</h4>
                </div>
                {waterRule ? (
                  <div className="p-5 rounded-2xl bg-secondary/5 border border-secondary/20">
                    <p className="text-xl font-bold text-secondary">{waterRule.amount}</p>
                    <p className="text-sm font-medium mt-1">{waterRule.frequency}</p>
                    <p className="text-xs mt-3 text-muted-foreground italic leading-relaxed">{waterRule.note}</p>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-muted/10 border border-dashed border-border text-center">
                    <p className="text-sm text-muted-foreground italic">No specific rule found.</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-accent font-bold">
                    <Beaker size={20} />
                    <h4>Fertilizer Needs</h4>
                </div>
                {fertRule ? (
                  <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20">
                    <p className="text-xl font-bold text-accent">{fertRule.dosage}</p>
                    <p className="text-sm font-medium mt-1">{fertRule.frequency}</p>
                    <p className="text-xs mt-3 text-muted-foreground italic leading-relaxed">{fertRule.note}</p>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-muted/10 border border-dashed border-border text-center">
                    <p className="text-sm text-muted-foreground italic">No specific rule found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareGuideDetail;

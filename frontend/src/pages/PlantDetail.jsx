import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { 
  ArrowLeft, Droplets, Sun, Thermometer, 
  Calendar, Info, Sparkles, Loader2, 
  CheckCircle2, Plus, ShoppingCart, 
  ChevronRight, Heart, Share2, AlertTriangle, Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = ["Seedling", "Vegetative", "Flowering", "Fruiting"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter", "All Year"];

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState("Vegetative");
  const [activeSeason, setActiveSeason] = useState("Summer");
  const [todayAdvice, setTodayAdvice] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) setActiveSeason("Spring");
    else if (month >= 5 && month <= 7) setActiveSeason("Summer");
    else if (month >= 8 && month <= 10) setActiveSeason("Autumn");
    else setActiveSeason("Winter");
  }, []);

  useEffect(() => {
    const fetchPlantData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/plants/${id}`);
        const plantData = res.data;
        
        // Fetch matching care guide
        let guideData = {};
        try {
          const guideRes = await axios.get(`${BACKEND_URL}/api/care-guide`);
          const list = guideRes.data.guides || (Array.isArray(guideRes.data) ? guideRes.data : []);
          const match = list.find(g => g.name?.toLowerCase().trim() === plantData.name?.toLowerCase().trim());
          if (match) {
            const fullGuideRes = await axios.get(`${BACKEND_URL}/api/care-guide/${match._id}`);
            guideData = fullGuideRes.data.guide || fullGuideRes.data;
          }
        } catch (e) {
          console.log("Care guide fetch failed", e);
        }

        setPlant({
          ...guideData,
          ...plantData,
          waterConfig: guideData.waterConfig || plantData.waterConfig,
          fertilizerConfig: guideData.fertilizerConfig || plantData.fertilizerConfig,
          stageImages: guideData.stageImages || plantData.stageImages,
        });
      } catch (err) {
        console.error("Fetch plant error", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPlantData();
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

  const handleForToday = async () => {
    setAnalyzing(true);
    try {
      const waterRule = getRule(plant?.waterConfig);
      const fertRule = getRule(plant?.fertilizerConfig);
      
      const city = JSON.parse(localStorage.getItem('user'))?.location?.city || 'London';

      const res = await axios.post(`${BACKEND_URL}/api/weather/care-adjustment`, {
        city,
        plantName: plant.name,
        lifeStage: activeStage,
        generalWater: waterRule ? `${waterRule.amount} ${waterRule.frequency}` : "Standard",
        generalFert: fertRule ? `${fertRule.dosage} ${fertRule.frequency}` : "Standard",
      });
      setTodayAdvice(res.data);
    } catch (e) {
      console.error("Weather advice failed", e);
    } finally {
      setAnalyzing(false);
    }
  };

  const addToGarden = async () => {
    setSaving(true);
    // Logic for adding to garden...
    setTimeout(() => setSaving(false), 1000);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-primary w-12 h-12" />
      <p className="text-muted-foreground">Loading plant details...</p>
    </div>
  );

  if (!plant) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Plant not found</h2>
      <button onClick={() => navigate('/explore')} className="text-primary mt-4 font-bold hover:underline">Back to Explore</button>
    </div>
  );

  const waterRule = getRule(plant?.waterConfig);
  const fertRule = getRule(plant?.fertilizerConfig);
  const heroImage = plant?.stageImages?.[activeStage.toLowerCase()] || plant?.image || "https://images.unsplash.com/photo-1512428813833-df504488350d?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-xl transition-all w-fit"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images and Basic Info */}
        <div className="space-y-6">
          <motion.div 
            layoutId="hero-image"
            className="aspect-[4/3] rounded-3xl overflow-hidden bg-surface border border-border"
          >
            <img src={heroImage} alt={plant.name} className="w-full h-full object-cover" />
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={addToGarden}
              disabled={saving}
              className="flex-1 bg-primary text-primary-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Add to Garden</>}
            </button>
            <button className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all">
              <ShoppingCart size={24} />
            </button>
            <button className="p-4 rounded-2xl bg-surface border border-border hover:border-destructive/50 transition-all">
              <Heart size={24} />
            </button>
          </div>
        </div>

        {/* Right: Details and Care */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase border border-primary/20">
                {plant.type || 'Plant'}
              </span>
              {plant.beginnerFriendly && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full uppercase flex items-center gap-1">
                  <CheckCircle2 size={12} /> Beginner Friendly
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">{plant.name}</h1>
            <p className="text-xl text-muted-foreground italic">{plant.scientificName}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col items-center text-center">
              <Sun className="text-accent mb-2" size={24} />
              <span className="text-xs font-bold text-muted-foreground uppercase">Sunlight</span>
              <span className="text-sm font-bold mt-1">{plant.sunlight || 'N/A'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col items-center text-center">
              <Droplets className="text-secondary mb-2" size={24} />
              <span className="text-xs font-bold text-muted-foreground uppercase">Water</span>
              <span className="text-sm font-bold mt-1">{plant.water || 'N/A'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col items-center text-center">
              <Thermometer className="text-destructive mb-2" size={24} />
              <span className="text-xs font-bold text-muted-foreground uppercase">Difficulty</span>
              <span className="text-sm font-bold mt-1 uppercase">{plant.difficulty || 'Easy'}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Info size={20} className="text-primary" />
              Description
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {plant.description || "No description available for this plant."}
            </p>
          </div>

          {plant.careTips?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Leaf size={20} className="text-primary" />
                Care Tips
              </h3>
              <ul className="space-y-2">
                {plant.careTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/50">
                    <CheckCircle2 size={16} className="text-primary mt-1 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Care Section */}
      <div className="mt-12 p-8 rounded-3xl bg-surface border border-border space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Calendar size={28} className="text-primary" />
              Life Stage & Season
            </h3>
            
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Life Stage</p>
              <div className="flex flex-wrap gap-2">
                {STAGES.map(stage => (
                  <button 
                    key={stage}
                    onClick={() => { setActiveStage(stage); setTodayAdvice(null); }}
                    className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${
                      activeStage === stage ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-muted-foreground hover:border-muted'
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Season</p>
              <div className="flex flex-wrap gap-2">
                {SEASONS.map(season => (
                  <button 
                    key={season}
                    onClick={() => { setActiveSeason(season); setTodayAdvice(null); }}
                    className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${
                      activeSeason === season ? 'bg-secondary border-secondary text-secondary-foreground' : 'bg-background border-border text-muted-foreground hover:border-muted'
                    }`}
                  >
                    {season}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:w-1/3 flex flex-col gap-4">
            <button 
              onClick={handleForToday}
              disabled={analyzing}
              className="w-full bg-accent text-accent-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="animate-spin" /> : <><Sparkles size={20} /> Get Today's AI Advice</>}
            </button>
            <p className="text-xs text-center text-muted-foreground italic">
              Powered by Gemini AI - Tailored care advice based on your local weather.
            </p>
          </div>
        </div>

        <AnimatePresence>
          {todayAdvice && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 space-y-4">
                <div className="flex items-center gap-2 text-accent">
                  <Sparkles size={20} />
                  <h4 className="font-bold">Today's Weather Adjustment</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-bold uppercase text-muted-foreground">Watering Adjustment</p>
                    <p className="text-lg">{todayAdvice.waterAdjustment}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold uppercase text-muted-foreground">Fertilizer Adjustment</p>
                    <p className="text-lg">{todayAdvice.fertilizerAdjustment}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-accent/10">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-bold text-accent">AI Rationale:</span> {todayAdvice.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <Droplets size={18} className="text-secondary" />
              Standard Watering Rule
            </h4>
            {waterRule ? (
              <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                <p className="text-lg font-bold">{waterRule.amount}</p>
                <p className="text-sm text-muted-foreground">{waterRule.frequency}</p>
                <p className="text-xs mt-2 italic text-muted-foreground">{waterRule.note}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No specific watering rule for this stage/season.</p>
            )}
          </div>
          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <Plus size={18} className="text-accent" />
              Standard Fertilizer Rule
            </h4>
            {fertRule ? (
              <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                <p className="text-lg font-bold">{fertRule.dosage}</p>
                <p className="text-sm text-muted-foreground">{fertRule.frequency}</p>
                <p className="text-xs mt-2 italic text-muted-foreground">{fertRule.note}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No specific fertilizer rule for this stage/season.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;

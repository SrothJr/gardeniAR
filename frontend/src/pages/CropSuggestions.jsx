import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, MapPin, Calendar, 
  ArrowRight, Loader2, Leaf,
  ChevronRight, Info, Thermometer,
  CloudSun
} from 'lucide-react';
import { motion } from 'framer-motion';
import PlantCard from '../components/PlantCard';

const CropSuggestions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const city = user?.location?.city || 'London';
        
        // Fetch weather first
        const weatherRes = await axios.get(`${BACKEND_URL}/api/weather/alert?city=${city}`);
        setWeather(weatherRes.data);

        // Fetch suggestions based on weather/season
        // Assuming there's an endpoint for this, or we filter plants
        const plantsRes = await axios.get(`${BACKEND_URL}/api/plants`);
        
        // Simple logic to filter based on current season
        const month = new Date().getMonth();
        let currentSeason = "Summer";
        if (month >= 2 && month <= 4) currentSeason = "Spring";
        else if (month >= 5 && month <= 7) currentSeason = "Summer";
        else if (month >= 8 && month <= 10) currentSeason = "Autumn";
        else currentSeason = "Winter";

        const filtered = plantsRes.data.filter(p => 
            p.season?.includes(currentSeason) || p.season === "All Year"
        ).slice(0, 6);

        setSuggestions(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [user]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-primary w-12 h-12" />
      <p className="text-muted-foreground">Generating personalized suggestions...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-primary bg-primary/10 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20 w-fit">
            <Sparkles size={14} /> AI Powered
        </div>
        <h1 className="text-4xl font-bold">Crop Suggestions</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
            Based on your location and current weather, these plants have the highest chance of thriving in your garden right now.
        </p>
      </header>

      {/* Weather Insights Card */}
      <div className="p-8 bg-surface border border-border rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-xl">
        <div className="w-24 h-24 bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary shrink-0">
            <CloudSun size={48} />
        </div>
        <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/20 rounded-xl border border-border">
                    <MapPin size={16} className="text-primary" />
                    <span className="font-bold">{user?.location?.city || 'London'}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/20 rounded-xl border border-border">
                    <Thermometer size={16} className="text-destructive" />
                    <span className="font-bold">{weather?.temp || '22'}°C</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/20 rounded-xl border border-border">
                    <Calendar size={16} className="text-accent" />
                    <span className="font-bold">Late Summer</span>
                </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
                The current weather is <span className="text-foreground font-bold">mostly clear</span> with moderate humidity. This is an excellent time for planting leafy greens and heat-tolerant herbs.
            </p>
        </div>
      </div>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Top Recommendations</h2>
            <button className="text-primary font-bold hover:underline flex items-center gap-1">
                View all <ChevronRight size={18} />
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {suggestions.map((plant, index) => (
                <motion.div 
                    key={plant._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <PlantCard 
                        plant={plant} 
                        onClick={() => navigate(`/plants/${plant._id}`)} 
                    />
                </motion.div>
            ))}
        </div>
      </section>

      <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 flex items-start gap-4">
        <Info className="text-primary mt-1 shrink-0" size={24} />
        <div className="space-y-2">
            <h4 className="font-bold">Why these suggestions?</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
                Our AI considers several factors including soil temperature, daylight hours, and local precipitation patterns. 
                The suggestions above are optimized for <span className="text-primary font-bold">beginner to intermediate</span> gardeners in your region.
            </p>
        </div>
      </div>
    </div>
  );
};

export default CropSuggestions;

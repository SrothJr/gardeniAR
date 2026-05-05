import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Leaf, CheckSquare, MessageCircle, 
  ShoppingCart, TrendingUp, Box, Camera, 
  Scan, FlaskConical, Bell, ChevronRight,
  Info, Lock, Sparkles, CloudRain, Wind, Droplets,
  Sun, Thermometer, AlertTriangle, X, CheckCircle2, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { BACKEND_URL } from '../config';

const Home = () => {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [showWeatherPanel, setShowWeatherPanel] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setWeatherLoading(true);
      const city = user?.location?.city || 'London';
      const res = await axios.get(`${BACKEND_URL}/api/weather/alert?city=${city}`);
      setWeather(res.data);
    } catch (err) {
      console.error("fetchWeather error", err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const firstName = user?.name?.split(' ')[0] ?? "Guest";

  const WeatherIcon = ({ condition }) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('rain')) return <CloudRain className="text-secondary" />;
    if (cond.includes('wind')) return <Wind className="text-muted-foreground" />;
    if (cond.includes('clear') || cond.includes('sun')) return <Sun className="text-accent" />;
    return <Droplets className="text-primary" />;
  };

  const ServiceTile = ({ icon: Icon, label, sub, href, tone = "mint", locked = false }) => {
    const tones = {
      mint: "bg-primary/20 text-primary",
      blue: "bg-secondary/20 text-secondary",
      amber: "bg-accent/20 text-accent",
      rose: "bg-destructive/20 text-destructive",
    };

    return (
      <Link 
        to={href}
        className={`p-4 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all group relative overflow-hidden ${locked ? 'opacity-75' : ''}`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${tones[tone] || tones.mint}`}>
          <Icon size={20} />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm lg:text-base truncate">{label}</h3>
          {locked && <Lock size={12} className="text-muted-foreground" />}
        </div>
        <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>
      </Link>
    );
  };

  const FeaturedCard = ({ title, subtitle, icon: Icon, href, color = "primary" }) => (
    <Link 
      to={href}
      className="flex-1 min-w-[280px] p-6 rounded-3xl bg-surface border border-border relative overflow-hidden group hover:border-primary/30 transition-all"
    >
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-2xl bg-${color} flex items-center justify-center mb-4 text-${color}-foreground`}>
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{subtitle}</p>
        <div className="flex items-center gap-2 text-sm font-bold">
          <span>Open</span>
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
      {/* Decorative background element */}
      <div className={`absolute -right-4 -bottom-4 w-32 h-32 bg-${color}/5 rounded-full blur-2xl group-hover:bg-${color}/10 transition-colors`} />
    </Link>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GardeniAR</h1>
          <p className="text-muted-foreground mt-1">
            {user ? `Welcome back, ${firstName}` : "Grow smarter, every day"}
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <button 
                    onClick={() => setShowWeatherPanel(!showWeatherPanel)}
                    className="p-3 rounded-xl bg-surface border border-border hover:bg-muted/50 transition-all relative"
                >
                    <Bell size={20} className={weather?.alert ? 'text-destructive animate-pulse' : 'text-foreground'} />
                    {weather && <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-surface" />}
                </button>

                <AnimatePresence>
                    {showWeatherPanel && weather && weather.weather && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-80 bg-surface border border-border rounded-3xl shadow-2xl z-[100] p-6 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold flex items-center gap-2">
                                    <WeatherIcon condition={weather.weather.condition} />
                                    Weather Report
                                </h4>
                                <button onClick={() => setShowWeatherPanel(false)} className="text-muted-foreground hover:text-foreground">
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-background rounded-2xl border border-border flex flex-col items-center">
                                    <Thermometer size={16} className="text-destructive mb-1" />
                                    <span className="text-lg font-bold">{weather.weather.temperature}°C</span>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Temp</span>
                                </div>
                                <div className="p-3 bg-background rounded-2xl border border-border flex flex-col items-center">
                                    <Droplets size={16} className="text-secondary mb-1" />
                                    <span className="text-lg font-bold">{weather.weather.humidity}%</span>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Humidity</span>
                                </div>
                            </div>

                            {weather.alert ? (
                                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl space-y-2">
                                    <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                                        <AlertTriangle size={16} />
                                        AI Garden Alert
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {weather.alert}
                                    </p>
                                </div>
                            ) : (
                                <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3">
                                    <CheckCircle2 size={16} className="text-primary" />
                                    <p className="text-xs font-medium">Perfect conditions for your garden today.</p>
                                </div>
                            )}

                            <Link to="/crop-suggestions" className="block text-center text-xs font-bold text-primary hover:underline pt-2">
                                View AI Crop Suggestions
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {user && (
                <Link to="/premium" className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${user.isPremium ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'}`}>
                    {user.isPremium ? <Award size={16} /> : <Sparkles size={16} />}
                    <span>{user.isPremium ? 'Pro' : 'Upgrade'}</span>
                </Link>
            )}
        </div>
      </header>

      {/* Free User Info Strip */}
      {user && !user.isPremium && (
        <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/20 flex items-center gap-3">
          <Info size={18} className="text-secondary shrink-0" />
          <p className="text-sm text-muted-foreground flex-1">
            <span className="text-secondary font-bold">2 free uses</span> left for Share Garden. 
            <span className="hidden sm:inline"> Upgrade to unlock Growth & AR features.</span>
          </p>
          <Link to="/premium" className="text-sm font-bold text-secondary hover:underline">
            Upgrade
          </Link>
        </div>
      )}

      {/* Featured Grid */}
      <div className="flex flex-wrap gap-6">
        <FeaturedCard 
          title="Weed Scanner" 
          subtitle="Point your camera and get AI identification" 
          icon={Scan} 
          href="/identify" 
          color="primary"
        />
        <FeaturedCard 
          title="Soil Test" 
          subtitle="Scan soil color & texture for quick tips" 
          icon={FlaskConical} 
          href="/soil" 
          color="secondary"
        />
      </div>

      {/* Services Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Services</h2>
          <Link to="/explore" className="text-sm font-bold text-secondary flex items-center gap-1 hover:underline">
            See all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <ServiceTile icon={Search} label="Explore" sub="Plants & tips" href="/explore" tone="blue" />
          <ServiceTile icon={Leaf} label="Companions" sub="Plant buddies" href="/companions" tone="amber" />
          <ServiceTile icon={CheckSquare} label="Tasks" sub="Daily checklist" href="/checklist" tone="amber" />
          <ServiceTile icon={MessageCircle} label="Forum" sub="Ask & help" href="/forum" tone="blue" />
          <ServiceTile icon={ShoppingCart} label="Cart" sub="Your items" href="/cart" tone="rose" />
          <ServiceTile icon={TrendingUp} label="Growth" sub="Track plants" href="/ar-tracker" tone="mint" locked={!user?.isPremium} />
          <ServiceTile icon={Box} label="Plant Tracker" sub="AR & Disease" href="/ar-tracker" tone="mint" locked={!user?.isPremium} />
          <ServiceTile icon={Camera} label="Share" sub="2 free uses" href="/share" tone="rose" />
        </div>
      </section>

      {/* Promo Section */}
      <section>
        <h2 className="text-xl font-bold mb-6">For you</h2>
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          <Link 
            to="/collections/seasonal"
            className="shrink-0 w-80 p-6 rounded-3xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all group"
          >
            <h3 className="text-xl font-bold mb-2">Seasonal picks</h3>
            <p className="text-sm text-muted-foreground">Easy plants to start this week</p>
            <div className="mt-8 flex justify-end">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground transform group-hover:translate-x-2 transition-transform">
                    <ChevronRight size={24} />
                </div>
            </div>
          </Link>
          <Link 
            to="/routines/watering"
            className="shrink-0 w-80 p-6 rounded-3xl bg-secondary/10 border border-secondary/20 hover:bg-secondary/15 transition-all group"
          >
            <h3 className="text-xl font-bold mb-2">Watering routine</h3>
            <p className="text-sm text-muted-foreground">Simple schedule for healthier growth</p>
            <div className="mt-8 flex justify-end">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground transform group-hover:translate-x-2 transition-transform">
                    <ChevronRight size={24} />
                </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

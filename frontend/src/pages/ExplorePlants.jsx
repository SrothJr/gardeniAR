import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import PlantCard from '../components/PlantCard';
import { 
  Search, Filter, SlidersHorizontal, ChevronDown, 
  X, Loader2, Leaf, Camera, ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExplorePlants = () => {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const navigate = useNavigate();

  // Filter States
  const [typeFilter, setTypeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [heatFilter, setHeatFilter] = useState("all");
  const [priceBand, setPriceBand] = useState("all");

  const fetchPlants = async (q = "") => {
    setLoading(true);
    try {
      const url = q
        ? `${BACKEND_URL}/api/plants?search=${encodeURIComponent(q)}`
        : `${BACKEND_URL}/api/plants`;
      const res = await axios.get(url);
      setPlants(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchPlants error", err);
      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchPlants(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filteredPlants = useMemo(() => {
    let list = plants;

    if (typeFilter !== "all") {
      list = list.filter((p) => {
        const cat = (p.category || p.type || "").toLowerCase();
        if (typeFilter === "herb") return cat.includes("herb");
        if (typeFilter === "vegetable") return cat.includes("vegetable") || cat.includes("veg");
        if (typeFilter === "houseplant") return cat.includes("house") || cat.includes("indoor") || cat.includes("succulent");
        return true;
      });
    }

    if (difficultyFilter !== "all") {
      list = list.filter((p) => {
        const diff = (p.difficulty || "").toLowerCase();
        if (difficultyFilter === "easy") return p.beginnerFriendly === true || diff === "easy";
        if (difficultyFilter === "medium") return diff === "medium" || !diff;
        if (difficultyFilter === "hard") return diff === "hard";
        return true;
      });
    }

    if (heatFilter !== "all") {
      list = list.filter((p) => {
        const heat = (p.heatTolerance || "").toLowerCase();
        const sun = (p.sunlight || "").toLowerCase();
        if (heatFilter === "cool") return heat === "low" || sun.includes("partial") || sun.includes("shade");
        if (heatFilter === "warm") return heat === "high" || sun.includes("full") || (p.season || "").toLowerCase().includes("summer");
        return true;
      });
    }

    if (priceBand !== "all") {
      list = list.filter((p) => {
        const price = p.price;
        if (price == null) return false;
        if (priceBand === "budget") return price < 35;
        if (priceBand === "mid") return price >= 35 && price <= 70;
        if (priceBand === "premium") return price > 70;
        return true;
      });
    }

    return list;
  }, [plants, typeFilter, difficultyFilter, heatFilter, priceBand]);

  const FilterChip = ({ label, active, onClick, onClear }) => (
    <div 
      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all cursor-pointer ${
        active 
          ? 'bg-primary/10 border-primary text-primary' 
          : 'bg-surface border-border text-muted-foreground hover:border-muted'
      }`}
      onClick={onClick}
    >
      {label}
      {active && onClear && (
        <X size={14} className="hover:text-foreground" onClick={(e) => { e.stopPropagation(); onClear(); }} />
      )}
      {!active && <ChevronDown size={14} />}
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Explore Plants</h1>
        <p className="text-muted-foreground mt-1">Find your perfect green companion</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for plants..."
            className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
          />
        </div>
        <button 
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-6 py-4 rounded-2xl border font-bold transition-all ${
            filtersOpen ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border text-foreground hover:bg-muted/50'
          }`}
        >
          <SlidersHorizontal size={20} />
          <span>Filters</span>
        </button>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-surface border border-border rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</label>
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 outline-none focus:border-primary transition-all"
                >
                  <option value="all">All Types</option>
                  <option value="herb">Herbs</option>
                  <option value="vegetable">Vegetables</option>
                  <option value="houseplant">Houseplants</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Difficulty</label>
                <select 
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 outline-none focus:border-primary transition-all"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Environment</label>
                <select 
                  value={heatFilter}
                  onChange={(e) => setHeatFilter(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 outline-none focus:border-primary transition-all"
                >
                  <option value="all">Any Environment</option>
                  <option value="cool">Cool / Shade</option>
                  <option value="warm">Heat Lover</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price</label>
                <select 
                  value={priceBand}
                  onChange={(e) => setPriceBand(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 outline-none focus:border-primary transition-all"
                >
                  <option value="all">Any Price</option>
                  <option value="budget">Budget ({"<"} ৳35)</option>
                  <option value="mid">Mid (৳35–70)</option>
                  <option value="premium">Premium ({">"} ৳70)</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {loading ? <Loader2 className="animate-spin text-primary" size={20} /> : <Leaf className="text-primary" size={20} />}
          <span>{filteredPlants.length} Plants Found</span>
        </h2>
      </div>

      {loading && plants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary w-12 h-12" />
          <p className="text-muted-foreground">Finding the best plants for you...</p>
        </div>
      ) : filteredPlants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center text-4xl">🌱</div>
          <div>
            <h3 className="text-xl font-bold">No plants found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your filters or search terms</p>
          </div>
          <button 
            onClick={() => {
              setSearch('');
              setTypeFilter('all');
              setDifficultyFilter('all');
              setHeatFilter('all');
              setPriceBand('all');
            }}
            className="text-primary font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlants.map((plant) => (
            <PlantCard 
              key={plant._id} 
              plant={plant} 
              onClick={() => navigate(`/plants/${plant._id}`)} 
            />
          ))}
        </div>
      )}

      {/* Mobile FAB Dock */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 lg:hidden">
        <button 
          onClick={() => navigate('/share')}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Camera size={24} />
        </button>
        <button 
          onClick={() => navigate('/cart')}
          className="w-14 h-14 bg-surface border border-border text-foreground rounded-2xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <ShoppingCart size={24} />
        </button>
      </div>
    </div>
  );
};

export default ExplorePlants;

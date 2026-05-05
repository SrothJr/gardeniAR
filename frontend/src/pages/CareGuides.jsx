import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import PlantCard from '../components/PlantCard';
import { Search, Loader2, Leaf, BookOpen } from 'lucide-react';

const CareGuides = () => {
  const [guides, setGuides] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchGuides = async (query = "") => {
    setLoading(true);
    try {
      const url = query
        ? `${BACKEND_URL}/api/care-guide?search=${encodeURIComponent(query)}`
        : `${BACKEND_URL}/api/care-guide`;
      const res = await axios.get(url);
      const data = res.data.guides || res.data;
      setGuides(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch guides error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides(search);
  }, [search]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Care Guides</h1>
        <p className="text-muted-foreground mt-1">Detailed maintenance instructions for your plants</p>
      </header>

      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for care guides..."
          className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary w-12 h-12" />
          <p className="text-muted-foreground">Loading guides...</p>
        </div>
      ) : guides.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-border rounded-3xl">
          <BookOpen size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-bold">No guides found</h3>
          <p className="text-muted-foreground mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <PlantCard 
              key={guide._id} 
              plant={guide} 
              onClick={() => navigate(`/care-guides/${guide._id}`)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CareGuides;

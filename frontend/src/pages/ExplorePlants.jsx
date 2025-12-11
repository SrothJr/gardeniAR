import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PlantCard from '../components/PlantCard';

function ExplorePlants() {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState('');
  const [heroShrunk, setHeroShrunk] = useState(false);
  const navigate = useNavigate();

  const fetchPlants = async (searchTerm = '') => {
    try {
      const url = searchTerm
        ? `http://localhost:5000/api/plants?search=${encodeURIComponent(
            searchTerm
          )}`
        : 'http://localhost:5000/api/plants';

      const res = await fetch(url);
      const data = await res.json();
      setPlants(data);
    } catch (err) {
      console.error('Error fetching plants:', err);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchPlants(value);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      
      <section
        onMouseEnter={() => setHeroShrunk(false)}
        className={`relative overflow-hidden transition-all duration-500 ${
          heroShrunk ? 'h-24 md:h-28' : 'h-[45vh] md:h-[55vh]'
        }`}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-70 brightness-[1.25] contrast-[1.1]"
          src="/leaf-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px]" />

        <div className="relative max-w-6xl mx-auto h-full px-4 flex flex-col justify-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-emerald-300/80">
            GardeniAR
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mt-2">
            Grow smarter. Explore your plants.
          </h1>
          <p className="max-w-xl text-sm md:text-base text-slate-200/80 mt-3">
            Search plants, see care tips, and build your own digital garden.
          </p>
        </div>
      </section>

      
      <div className="relative">
        
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 h-32 
                     bg-gradient-to-b from-transparent via-slate-950/70 to-slate-950"
        />

        
        <section
          onMouseEnter={() => setHeroShrunk(true)}
          className="relative max-w-6xl mx-auto px-4 pb-10 pt-6"
        >
          <div className="flex items-baseline justify-between gap-2 mb-4">
            <h2 className="text-2xl font-semibold">Explore Plants</h2>
            <span className="text-xs text-slate-400">
              {plants.length} plants
            </span>
          </div>

          <SearchBar value={search} onChange={handleSearchChange} />

          {plants.length === 0 ? (
            <p className="text-slate-300 mt-6">No plants found.</p>
          ) : (
            <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {plants.map((plant) => (
                <PlantCard
                  key={plant._id}
                  plant={plant}
                  onClick={() => navigate(`/plants/${plant._id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ExplorePlants;

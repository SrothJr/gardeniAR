import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/plants/${id}`);
        const data = await res.json();
        setPlant(data);
      } catch (err) {
        console.error('Error fetching plant:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        Plant not found
      </div>
    );
  }

  const handleAddToGarden = () => {
    const stored = JSON.parse(localStorage.getItem('myGarden') || '[]');
    if (!stored.includes(plant._id)) {
      stored.push(plant._id);
      localStorage.setItem('myGarden', JSON.stringify(stored));
    }
    alert('Added to My Garden');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-slate-300 hover:text-white"
        >
          <span className="text-lg">←</span>
          <span>Back</span>
        </button>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md">
          {/* Image */}
          <div className="h-56 w-full rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center">
            {plant.image ? (
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-slate-500 text-xs">No image</span>
            )}
          </div>

          {/* Main info */}
          <div>
            <h1 className="text-2xl font-semibold">{plant.name}</h1>
            <p className="mt-1 text-sm text-slate-300">
              {plant.scientificName && (
                <span className="italic">{plant.scientificName}</span>
              )}
              {plant.type && (
                <span>
                  {' '}
                  • <span className="capitalize">{plant.type}</span>
                </span>
              )}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {plant.sunlight && (
                <span className="px-3 py-1 rounded-full bg-slate-800">
                  Sun: {plant.sunlight}
                </span>
              )}
              {plant.water && (
                <span className="px-3 py-1 rounded-full bg-slate-800">
                  Water: {plant.water}
                </span>
              )}
            </div>
          </div>

          {/* Care tips */}
          {plant.careTips && plant.careTips.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-4">
              <h2 className="font-semibold text-sm mb-2">Care Tips</h2>
              <ul className="list-disc list-inside text-sm space-y-1">
                {plant.careTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Soil */}
          {plant.soil && (
            <div className="bg-slate-800 rounded-xl p-4">
              <h2 className="font-semibold text-sm mb-2">Recommended Soil</h2>
              <p className="text-sm text-slate-200">{plant.soil}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <button
              onClick={handleAddToGarden}
              className="flex-1 py-2 rounded-full bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors"
            >
              Add to My Garden
            </button>
            <button className="px-4 py-2 rounded-full bg-slate-800 text-sm hover:bg-slate-700">
              Scan Soil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantDetail;

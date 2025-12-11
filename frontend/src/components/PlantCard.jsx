function PlantCard({ plant, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-400/70 transition-all duration-150"
    >
      
      <div className="h-72 w-full bg-slate-800 flex items-center justify-center">

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

      
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3 truncate">{plant.name}</h2>

        <div className="flex flex-wrap gap-2 text-[11px]">
          {plant.sunlight && (
            <span className="px-2 py-1 rounded-full bg-amber-100/90 text-amber-900">
              {plant.sunlight}
            </span>
          )}
          {plant.water && (
            <span className="px-2 py-1 rounded-full bg-sky-100/90 text-sky-900">
              {plant.water}
            </span>
          )}
          {plant.type && (
            <span className="px-2 py-1 rounded-full bg-emerald-100/90 text-emerald-900">
              {plant.type}
            </span>
          )}
          {plant.season && (
            <span className="px-2 py-1 rounded-full bg-violet-100/90 text-violet-900">
              {plant.season}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default PlantCard;

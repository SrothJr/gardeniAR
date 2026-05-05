import React from 'react';
import { Droplets, Sun, Thermometer, ChevronRight } from 'lucide-react';

const PlantCard = ({ plant, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-surface border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
        {plant.image ? (
          <img 
            src={plant.image} 
            alt={plant.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute top-4 right-4 px-3 py-1 bg-surface/80 backdrop-blur-md rounded-full text-xs font-bold text-primary border border-primary/20">
          {plant.type || 'Plant'}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold truncate group-hover:text-primary transition-colors">{plant.name}</h3>
          <span className="text-primary font-bold">৳{plant.price || '0'}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {plant.description || 'No description available.'}
        </p>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 rounded-xl bg-muted/30 text-muted-foreground">
            <Droplets size={14} className="mb-1 text-secondary" />
            <span className="text-[10px] font-bold uppercase truncate w-full text-center">{plant.water || 'N/A'}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-muted/30 text-muted-foreground">
            <Sun size={14} className="mb-1 text-accent" />
            <span className="text-[10px] font-bold uppercase truncate w-full text-center">{plant.sunlight || 'N/A'}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-muted/30 text-muted-foreground">
            <Thermometer size={14} className="mb-1 text-destructive" />
            <span className="text-[10px] font-bold uppercase truncate w-full text-center">{plant.difficulty || 'Easy'}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
          <span>View Details</span>
          <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default PlantCard;

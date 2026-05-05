import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { 
  Grid3X3, Plus, Trash2, Info, 
  AlertTriangle, CheckCircle2, Leaf,
  ChevronDown, Settings2, RefreshCw, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Companions = () => {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [grid, setGrid] = useState(
    Array(5).fill(null).map(() => Array(5).fill(null))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/companions`);
        setPlants(res.data);
      } catch (err) {
        console.error('Error fetching companions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  const generateGrid = () => {
    const r = Math.min(10, Math.max(1, parseInt(rows) || 5));
    const c = Math.min(10, Math.max(1, parseInt(cols) || 5));
    
    const newGrid = Array(r).fill(null).map((_, ri) =>
      Array(c).fill(null).map((_, ci) =>
        ri < grid.length && ci < grid[0].length ? grid[ri][ci] : null
      )
    );
    setGrid(newGrid);
  };

  const placePlant = (row, col) => {
    if (!selectedPlant) return;

    const neighbors = [
      [row - 1, col], [row + 1, col],
      [row, col - 1], [row, col + 1],
    ];

    let warning = null;
    for (let [r, c] of neighbors) {
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
        const neighbor = grid[r][c];
        if (neighbor && selectedPlant.avoided?.includes(neighbor.name)) {
          warning = `⚠️ Warning: ${selectedPlant.name} should not be placed next to ${neighbor.name}!`;
          break;
        }
      }
    }

    if (warning) {
        // We could show a toast here
        alert(warning);
    }

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = selectedPlant;
    setGrid(newGrid);
  };

  const clearCell = (row, col, e) => {
    e.stopPropagation();
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = null;
    setGrid(newGrid);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Companion Planner</h1>
          <p className="text-muted-foreground mt-1">Design your garden with plants that help each other grow</p>
        </div>
        <div className="flex items-center gap-4 bg-surface border border-border p-2 rounded-2xl">
          <div className="flex items-center gap-2 px-3">
            <span className="text-xs font-bold text-muted-foreground uppercase">Rows</span>
            <input 
              type="number" 
              value={rows} 
              onChange={(e) => setRows(e.target.value)}
              className="w-12 bg-background border border-border rounded-lg p-1 text-center font-bold outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2 px-3">
            <span className="text-xs font-bold text-muted-foreground uppercase">Cols</span>
            <input 
              type="number" 
              value={cols} 
              onChange={(e) => setCols(e.target.value)}
              className="w-12 bg-background border border-border rounded-lg p-1 text-center font-bold outline-none focus:border-primary"
            />
          </div>
          <button 
            onClick={generateGrid}
            className="bg-primary text-primary-foreground p-2 rounded-xl hover:opacity-90 transition-all"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Plant List */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-3xl p-6 space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Leaf size={20} className="text-primary" />
              Select a Plant
            </h3>
            <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                <div className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>
              ) : plants.map(plant => (
                <button
                  key={plant.name}
                  onClick={() => setSelectedPlant(plant)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedPlant?.name === plant.name 
                      ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5' 
                      : 'bg-background border-border text-muted-foreground hover:border-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{plant.name}</span>
                    {selectedPlant?.name === plant.name && <CheckCircle2 size={16} />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedPlant && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border rounded-3xl p-6 space-y-4"
            >
              <h4 className="font-bold text-lg text-primary">{selectedPlant.name} Traits</h4>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <p className="text-[10px] font-bold uppercase text-emerald-500 mb-1">Companions (Plant Near)</p>
                    <p className="text-xs text-foreground leading-relaxed">
                        {selectedPlant.companions?.join(', ') || 'No specific companions listed.'}
                    </p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-xl border border-destructive/20">
                    <p className="text-[10px] font-bold uppercase text-destructive mb-1">Avoid (Plant Away)</p>
                    <p className="text-xs text-foreground leading-relaxed">
                        {selectedPlant.avoided?.join(', ') || 'No specific plants to avoid.'}
                    </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: The Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 bg-surface border border-border rounded-[2.5rem] shadow-2xl overflow-x-auto">
            <div 
              className="grid gap-4 mx-auto w-fit"
              style={{ 
                gridTemplateColumns: `repeat(${grid[0].length}, minmax(80px, 1fr))` 
              }}
            >
              {grid.map((row, ri) => 
                row.map((cell, ci) => (
                  <div 
                    key={`${ri}-${ci}`}
                    onClick={() => placePlant(ri, ci)}
                    className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-2 transition-all cursor-pointer relative group ${
                      cell 
                        ? 'bg-primary/5 border-primary/30' 
                        : 'bg-muted/5 border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    {cell ? (
                      <>
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-1">
                          <Leaf size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-center truncate w-full">{cell.name}</span>
                        <button 
                          onClick={(e) => clearCell(ri, ci, e)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <Plus className="text-muted-foreground opacity-20 group-hover:opacity-50" size={24} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl flex items-start gap-4">
            <Info size={24} className="text-primary mt-1 shrink-0" />
            <div className="space-y-1">
                <h4 className="font-bold">Pro Tip</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Some plants attract beneficial insects that protect their companions. For example, Marigolds help almost any vegetable by repelling pests!
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const X = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default Companions;

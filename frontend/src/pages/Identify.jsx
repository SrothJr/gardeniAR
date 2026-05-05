import React, { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { 
  Camera, Upload, Info, Loader2, 
  CheckCircle2, AlertTriangle, RefreshCw,
  X, Scan, Bug, ChevronLeft, ChevronRight,
  ShieldCheck, ArrowRight, Sparkles, Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from "../context/AuthContext";

const Identify = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // State
  const [mode, setMode] = useState("auto");
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Manual Mode State
  const [weeds, setWeeds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch locally saved Weeds
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/weeds`)
      .then((res) => {
        setWeeds(res.data);
      })
      .catch((err) => console.error("Failed to load weeds", err));
  }, []);

  const nextWeed = () => setCurrentIndex((prev) => (prev + 1) % weeds.length);
  const prevWeed = () => setCurrentIndex((prev) => (prev - 1 + weeds.length) % weeds.length);

  const selectManualWeed = () => {
    const selected = weeds[currentIndex];
    setResult({
      name: selected.name,
      scientificName: selected.scientificName,
      confidence: "Manual Match",
      description: selected.description,
      isWeed: true,
      isPlant: true,
      removalInstructions: selected.removalInstructions,
    });
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setIsCameraOpen(false);

    if (user?.isPremium) {
        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => identifyPlant(blob));
    } else {
        setError("AI Identification is a Premium feature. Please upgrade to unlock.");
    }
  }, [webcamRef, user]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImgSrc(e.target.result);
      reader.readAsDataURL(file);
      
      if (user?.isPremium) {
        identifyPlant(file);
      } else {
        setError("AI Identification is a Premium feature. Please upgrade to unlock.");
      }
    }
  };

  const identifyPlant = async (imageBlobOrFile) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", imageBlobOrFile, "plant.jpg");

      const res = await axios.post(`${BACKEND_URL}/api/weeds/identify`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch (err) {
      console.error("Scan failed", err);
      setError("Could not identify plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImgSrc(null);
    setResult(null);
    setError(null);
    setIsCameraOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Identify Weed</h1>
          <p className="text-muted-foreground mt-1">Point your camera and get AI identification</p>
        </div>
        <div className="flex bg-surface border border-border rounded-2xl p-1 shrink-0">
          <button
            onClick={() => { setMode("auto"); reset(); }}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === "auto" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            AI Scanner
          </button>
          <button
            onClick={() => { setMode("manual"); reset(); }}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === "manual" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Manual Browse
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {mode === "auto" ? (
          <motion.div 
            key="auto-mode"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {!imgSrc && !isCameraOpen && (
              <div className="bg-surface border border-border rounded-3xl p-12 text-center space-y-6 shadow-xl shadow-primary/5">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <Scan size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">AI Weed Scanner</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Instant identification and removal instructions for common garden weeds and pests.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button 
                    onClick={() => setIsCameraOpen(true)}
                    className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                  >
                    <Camera size={20} /> Open Camera
                  </button>
                  <label className="bg-surface border border-border text-foreground font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-muted/50 transition-all cursor-pointer">
                    <Upload size={20} /> Upload Photo
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
            )}

            {isCameraOpen && (
              <div className="bg-surface border border-border rounded-3xl overflow-hidden relative shadow-2xl">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full aspect-square md:aspect-video object-cover"
                  videoConstraints={{ facingMode: 'environment' }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 border-2 border-primary/50 rounded-3xl relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                    </div>
                </div>
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
                  <button onClick={() => setIsCameraOpen(false)} className="w-14 h-14 bg-surface/80 backdrop-blur-md rounded-full flex items-center justify-center text-foreground hover:bg-surface transition-all">
                    <X size={24} />
                  </button>
                  <button onClick={capture} className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl shadow-primary/50 hover:scale-105 transition-all border-4 border-surface">
                    <Camera size={32} />
                  </button>
                </div>
              </div>
            )}

            {(loading || imgSrc) && !isCameraOpen && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="aspect-square rounded-3xl overflow-hidden border border-border bg-muted/20 relative shadow-xl">
                    <img src={imgSrc} alt="Scan sample" className="w-full h-full object-cover" />
                    {loading && (
                      <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-primary w-12 h-12" />
                        <p className="font-bold">Identifying specimen...</p>
                      </div>
                    )}
                  </div>
                  {!loading && (
                    <button onClick={reset} className="w-full py-4 rounded-2xl bg-surface border border-border font-bold flex items-center justify-center gap-2 hover:bg-muted/50 transition-all">
                      <RefreshCw size={20} /> Start New Scan
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {error && (
                    <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-3xl space-y-4">
                      <div className="flex items-center gap-2 text-destructive font-bold">
                        <AlertTriangle size={20} /> {user?.isPremium ? 'Scan Failed' : 'Premium Feature'}
                      </div>
                      <p className="text-sm text-muted-foreground">{error}</p>
                      {user?.isPremium ? (
                          <button onClick={reset} className="text-destructive font-bold text-sm hover:underline">Try again</button>
                      ) : (
                          <button onClick={() => navigate('/premium')} className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-all">Upgrade to Premium</button>
                      )}
                    </div>
                  )}

                  {result && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className={`p-8 rounded-3xl border space-y-4 shadow-xl ${result.isWeed ? 'bg-destructive/5 border-destructive/20' : 'bg-primary/5 border-primary/20'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {result.isWeed ? <Bug className="text-destructive" size={32} /> : <Leaf className="text-primary" size={32} />}
                                <div>
                                    <h3 className="text-2xl font-bold">{result.name}</h3>
                                    <p className="text-sm text-muted-foreground italic">{result.scientificName}</p>
                                </div>
                            </div>
                            <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${result.isWeed ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                {result.isWeed ? 'Weed / Pest' : 'Friendly Plant'}
                            </div>
                        </div>
                        
                        <div className="p-4 bg-background/50 rounded-2xl border border-border">
                            <p className="text-sm leading-relaxed">{result.description}</p>
                        </div>

                        {result.isWeed && result.removalInstructions && (
                            <div className="space-y-3 pt-2">
                                <h4 className="font-bold flex items-center gap-2 text-destructive">
                                    <ShieldCheck size={18} /> How to remove
                                </h4>
                                <p className="text-sm text-muted-foreground bg-surface/50 p-4 rounded-2xl border border-destructive/10 leading-relaxed">
                                    {result.removalInstructions}
                                </p>
                            </div>
                        )}
                        
                        {!result.isWeed && (
                            <button 
                                onClick={() => navigate('/explore')}
                                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                            >
                                Learn more about {result.name} <ArrowRight size={20} />
                            </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="manual-mode"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {weeds.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative group">
                  <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-surface shadow-2xl relative">
                    <img 
                        src={weeds[currentIndex].image || "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=1000&auto=format&fit=crop"} 
                        alt={weeds[currentIndex].name} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                        <h3 className="text-3xl font-bold text-white">{weeds[currentIndex].name}</h3>
                        <p className="text-primary font-bold italic">{weeds[currentIndex].scientificName}</p>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    <button onClick={prevWeed} className="w-12 h-12 bg-surface border border-border rounded-full flex items-center justify-center text-foreground hover:bg-muted/50 shadow-lg transition-all">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="bg-surface border border-border px-4 py-2 rounded-full text-xs font-bold text-muted-foreground shadow-lg">
                        {currentIndex + 1} / {weeds.length}
                    </div>
                    <button onClick={nextWeed} className="w-12 h-12 bg-surface border border-border rounded-full flex items-center justify-center text-foreground hover:bg-muted/50 shadow-lg transition-all">
                        <ChevronRight size={24} />
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-6">
                        <div className="p-6 bg-surface border border-border rounded-3xl space-y-4">
                            <h4 className="font-bold flex items-center gap-2 text-primary">
                                <Info size={18} /> Description
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">{weeds[currentIndex].description}</p>
                        </div>
                        <div className="p-6 bg-destructive/5 border border-destructive/20 rounded-3xl space-y-4">
                            <h4 className="font-bold flex items-center gap-2 text-destructive">
                                <ShieldCheck size={18} /> Removal Guide
                            </h4>
                            <p className="text-muted-foreground leading-relaxed text-sm italic">{weeds[currentIndex].removalInstructions}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={selectManualWeed}
                        className="w-full bg-primary text-primary-foreground font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                    >
                        <Sparkles size={20} /> This is my weed
                    </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-surface border border-border rounded-3xl">
                <Loader2 className="animate-spin mx-auto text-primary mb-4" size={32} />
                <p className="text-muted-foreground">Loading database...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Identify;

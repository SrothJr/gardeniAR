import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { 
  Camera, Upload, Info, Loader2, 
  CheckCircle2, AlertTriangle, RefreshCw,
  ArrowLeft, FlaskConical, Beaker,
  Droplets, Thermometer, Layers, Sun, Sparkles, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SoilTest = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setIsCameraOpen(false);

    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => analyzeSoil(blob));
  }, [webcamRef]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImgSrc(e.target.result);
      reader.readAsDataURL(file);
      analyzeSoil(file);
    }
  };

  const analyzeSoil = async (imageBlobOrFile) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", imageBlobOrFile, "soil.jpg");

      const res = await axios.post(`${BACKEND_URL}/api/soil/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch (err) {
      console.error("Soil analysis failed", err);
      setError("Could not analyze soil. Please ensure the image is clear.");
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
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Soil Analysis</h1>
          <p className="text-muted-foreground mt-1">Scan soil color & texture for quick tips</p>
        </div>
        <FlaskConical className="text-secondary w-10 h-10 opacity-50" />
      </header>

      <AnimatePresence mode="wait">
        {!imgSrc && !isCameraOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-surface border border-border rounded-3xl p-8 text-center space-y-6">
              <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto text-secondary">
                <Camera size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Ready to Scan?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Our AI will analyze the color, texture, and moisture hints of your soil to give you personalized recommendations.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button 
                  onClick={() => setIsCameraOpen(true)}
                  className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  <Camera size={20} /> Use Camera
                </button>
                <label className="bg-surface border border-border text-foreground font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-muted/50 transition-all cursor-pointer">
                  <Upload size={20} /> Upload Photo
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-surface border border-border rounded-3xl space-y-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                  <Info size={20} />
                </div>
                <h4 className="font-bold">Step 1</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Hold your device about 20-30 cm above the soil surface.</p>
              </div>
              <div className="p-6 bg-surface border border-border rounded-3xl space-y-3">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                  <Sun size={20} />
                </div>
                <h4 className="font-bold">Step 2</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Ensure good lighting but avoid direct harsh shadows on the soil.</p>
              </div>
              <div className="p-6 bg-surface border border-border rounded-3xl space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-bold">Step 3</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Wait for the AI to process and get your soil health report.</p>
              </div>
            </div>
          </motion.div>
        )}

        {isCameraOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-black fixed inset-0 z-[100] flex items-center justify-center"
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{ facingMode: 'environment' }}
            />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-dashed border-primary/50 rounded-3xl" />
            </div>
            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-8 px-6">
              <button 
                onClick={() => setIsCameraOpen(false)}
                className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/20"
              >
                <X size={32} />
              </button>
              <button 
                onClick={capture}
                className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl shadow-primary/50 hover:scale-105 transition-all border-4 border-white"
              >
                <Camera size={40} />
              </button>
            </div>
          </motion.div>
        )}

        {(loading || imgSrc) && !isCameraOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="aspect-square rounded-3xl overflow-hidden border border-border bg-muted/20 relative">
                  <img src={imgSrc} alt="Soil sample" className="w-full h-full object-cover" />
                  {loading && (
                    <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                      <Loader2 className="animate-spin text-primary w-12 h-12" />
                      <p className="font-bold">Analyzing soil profile...</p>
                    </div>
                  )}
                </div>
                {!loading && (
                  <button 
                    onClick={reset}
                    className="w-full py-4 rounded-2xl bg-surface border border-border font-bold flex items-center justify-center gap-2 hover:bg-muted/50 transition-all"
                  >
                    <RefreshCw size={20} /> Retake Photo
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {error && (
                  <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-3xl space-y-3">
                    <div className="flex items-center gap-2 text-destructive font-bold">
                      <AlertTriangle size={20} /> Analysis Error
                    </div>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <button onClick={reset} className="text-destructive font-bold text-sm hover:underline">Try again</button>
                  </div>
                )}

                {result && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-6 bg-surface border border-border rounded-3xl space-y-4">
                      <div className="flex items-center gap-3 text-secondary">
                        <Beaker size={24} />
                        <h3 className="text-xl font-bold">Soil Profile</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-muted/20">
                          <p className="text-xs font-bold uppercase text-muted-foreground">Type</p>
                          <p className="text-lg font-bold text-foreground capitalize">{result.soilType || 'Unknown'}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/20">
                          <p className="text-xs font-bold uppercase text-muted-foreground">Confidence</p>
                          <p className="text-lg font-bold text-foreground">{(result.confidence * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl space-y-4">
                      <div className="flex items-center gap-3 text-primary">
                        <Sparkles size={24} />
                        <h3 className="text-xl font-bold">AI Recommendations</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Layers className="text-primary mt-1 shrink-0" size={18} />
                            <div>
                                <p className="font-bold text-sm">Structure & Texture</p>
                                <p className="text-sm text-muted-foreground">{result.textureNote || "Good soil structure detected."}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Droplets className="text-secondary mt-1 shrink-0" size={18} />
                            <div>
                                <p className="font-bold text-sm">Moisture Retention</p>
                                <p className="text-sm text-muted-foreground">{result.moistureNote || "Optimal moisture levels for planting."}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="text-accent mt-1 shrink-0" size={18} />
                            <div>
                                <p className="font-bold text-sm">Suggested Plants</p>
                                <p className="text-sm text-muted-foreground">{result.recommendedPlants || "Herbs, Vegetables, and Flowers."}</p>
                            </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoilTest;

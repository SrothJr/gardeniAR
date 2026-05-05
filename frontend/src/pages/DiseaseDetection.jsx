import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { 
  Camera, Upload, Info, Loader2, 
  CheckCircle2, AlertTriangle, RefreshCw,
  X, Bug, ShieldAlert, ShieldCheck,
  Search, Droplets, FlaskConical, Thermometer,
  ArrowRight, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DiseaseDetection = () => {
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
      .then((blob) => detectDisease(blob));
  }, [webcamRef]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImgSrc(e.target.result);
      reader.readAsDataURL(file);
      detectDisease(file);
    }
  };

  const detectDisease = async (imageBlobOrFile) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", imageBlobOrFile, "leaf.jpg");

      const res = await axios.post(`${BACKEND_URL}/api/disease/detect`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch (err) {
      console.error("Detection failed", err);
      setError("Could not analyze leaf. Please ensure the photo is clear and shows the affected area.");
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
          <h1 className="text-3xl font-bold">Disease Detection</h1>
          <p className="text-muted-foreground mt-1">Identify and treat plant issues with AI analysis</p>
        </div>
        <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive">
            <Bug size={28} />
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!imgSrc && !isCameraOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-surface border border-border rounded-3xl p-12 text-center space-y-6 shadow-xl shadow-destructive/5">
              <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
                <ShieldAlert size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Plant Health Check</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Scan a leaf showing signs of stress, spots, or discoloration to get a diagnosis and treatment plan.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button 
                  onClick={() => setIsCameraOpen(true)}
                  className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  <Camera size={20} /> Open Scanner
                </button>
                <label className="bg-surface border border-border text-foreground font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-muted/50 transition-all cursor-pointer">
                  <Upload size={20} /> Upload Photo
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-surface border border-border rounded-3xl space-y-3">
                    <h4 className="font-bold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">1</span>
                        Focus
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Focus on a single leaf that clearly shows the symptoms.</p>
                </div>
                <div className="p-6 bg-surface border border-border rounded-3xl space-y-3">
                    <h4 className="font-bold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">2</span>
                        Lighting
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Use natural indirect light. Avoid using the flash if possible.</p>
                </div>
                <div className="p-6 bg-surface border border-border rounded-3xl space-y-3">
                    <h4 className="font-bold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">3</span>
                        Diagnosis
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Get a diagnosis and immediate steps to save your plant.</p>
                </div>
            </div>
          </motion.div>
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
            <div className="absolute inset-0 border-[2px] border-dashed border-destructive/30 m-8 rounded-3xl pointer-events-none" />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
              <button onClick={() => setIsCameraOpen(false)} className="w-14 h-14 bg-surface/80 backdrop-blur-md rounded-full flex items-center justify-center text-foreground hover:bg-surface transition-all">
                <X size={24} />
              </button>
              <button onClick={capture} className="w-20 h-20 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-2xl shadow-destructive/50 hover:scale-105 transition-all border-4 border-surface">
                <Search size={32} />
              </button>
            </div>
          </div>
        )}

        {(loading || imgSrc) && !isCameraOpen && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="aspect-square rounded-3xl overflow-hidden border border-border bg-muted/20 relative shadow-xl">
                <img src={imgSrc} alt="Leaf sample" className="w-full h-full object-cover" />
                {loading && (
                  <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-destructive w-12 h-12" />
                    <p className="font-bold">Analyzing pathology...</p>
                  </div>
                )}
              </div>
              {!loading && (
                <button onClick={reset} className="w-full py-4 rounded-2xl bg-surface border border-border font-bold flex items-center justify-center gap-2 hover:bg-muted/50 transition-all">
                  <RefreshCw size={20} /> New Scan
                </button>
              )}
            </div>

            <div className="space-y-6">
              {error && (
                <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 text-destructive font-bold">
                    <AlertTriangle size={20} /> Analysis Failed
                  </div>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <button onClick={reset} className="text-destructive font-bold text-sm hover:underline">Try again</button>
                </div>
              )}

              {result && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="p-8 rounded-3xl bg-surface border border-border space-y-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive">
                                <Bug size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{result.disease || 'Detected Issue'}</h3>
                                <p className="text-sm text-muted-foreground">Confidence: {(result.confidence * 100).toFixed(0)}%</p>
                            </div>
                        </div>
                        <div className="px-4 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-bold uppercase">
                            Warning
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-muted/20 rounded-2xl space-y-2">
                            <h4 className="font-bold text-sm flex items-center gap-2">
                                <Info size={16} className="text-primary" /> Symptoms
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{result.symptoms || "Visible spots and leaf discoloration detected."}</p>
                        </div>
                        
                        <div className="p-6 bg-destructive/5 border border-destructive/10 rounded-2xl space-y-3">
                            <h4 className="font-bold flex items-center gap-2 text-destructive">
                                <ShieldCheck size={18} /> Treatment Plan
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{result.treatment || "Isolate the plant, remove affected leaves, and apply organic fungicide."}</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/care-guides')}
                        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        View Full Care Guide <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiseaseDetection;

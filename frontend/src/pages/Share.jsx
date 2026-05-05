import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { 
  Camera, X, Send, Share2, 
  Download, RefreshCw, Loader2,
  Sparkles, Heart, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Share = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(true);
  const [caption, setCaption] = useState('');
  const [sharing, setSharing] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setIsCameraOpen(false);
  }, [webcamRef]);

  const handleShare = async () => {
    setSharing(true);
    // Mock sharing logic
    setTimeout(() => {
        setSharing(false);
        alert("Shared to Community!");
        navigate('/forum');
    }, 1500);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = 'gardeniAR-share.jpg';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Share Garden</h1>
          <p className="text-muted-foreground mt-1">Capture and share your garden's beauty</p>
        </div>
        <Share2 className="text-primary w-10 h-10 opacity-50" />
      </header>

      <AnimatePresence mode="wait">
        {isCameraOpen ? (
          <motion.div 
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface border border-border rounded-[2.5rem] overflow-hidden relative shadow-2xl aspect-square md:aspect-video"
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{ facingMode: 'environment' }}
            />
            <div className="absolute inset-0 border-[20px] border-surface/20 pointer-events-none" />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
              <button onClick={() => navigate(-1)} className="w-14 h-14 bg-surface/80 backdrop-blur-md rounded-full flex items-center justify-center text-foreground hover:bg-surface transition-all">
                <X size={24} />
              </button>
              <button onClick={capture} className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl shadow-primary/50 hover:scale-105 transition-all border-4 border-surface">
                <Camera size={32} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <div className="space-y-6">
                <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-border bg-muted/20 shadow-2xl relative group">
                    <img src={imgSrc} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-6 right-6 flex gap-2">
                        <button onClick={downloadImage} className="p-3 bg-surface/80 backdrop-blur-md rounded-xl text-foreground hover:bg-surface transition-all">
                            <Download size={20} />
                        </button>
                        <button onClick={() => setIsCameraOpen(true)} className="p-3 bg-surface/80 backdrop-blur-md rounded-xl text-foreground hover:bg-surface transition-all">
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-8 flex flex-col justify-center">
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Sparkles size={24} className="text-primary" />
                        Ready to post?
                    </h3>
                    <textarea 
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Write a caption for your garden..."
                        className="w-full bg-surface border border-border rounded-3xl p-6 outline-none focus:border-primary transition-all resize-none min-h-[150px]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-surface border border-border rounded-2xl flex items-center gap-3">
                        <Heart className="text-destructive" size={20} />
                        <span className="text-sm font-bold text-muted-foreground">Add to Favorites</span>
                    </div>
                    <div className="p-4 bg-surface border border-border rounded-2xl flex items-center gap-3">
                        <MessageSquare className="text-secondary" size={20} />
                        <span className="text-sm font-bold text-muted-foreground">Allow Comments</span>
                    </div>
                </div>

                <button 
                    onClick={handleShare}
                    disabled={sharing}
                    className="w-full bg-primary text-primary-foreground font-bold py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                    {sharing ? <Loader2 className="animate-spin" /> : <><Send size={24} /> Share with Community</>}
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Share;

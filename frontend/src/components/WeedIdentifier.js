import React, { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import './WeedIdentifier.css';

const WeedIdentifier = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Camera constraints for mobile rear camera
  const videoConstraints = {
    facingMode: { exact: "environment" } // Tries to use rear camera on mobile
  };

  // Fallback to default if environment camera fails (desktop)
  const handleUserMediaError = useCallback(() => {
    console.log("Rear camera not found, using default.");
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    identifyPlant(imageSrc);
  }, [webcamRef]);

  const identifyPlant = async (base64Image) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert base64 to blob
      const response = await fetch(base64Image);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('image', blob, 'plant.jpg');

      // Use localhost URL directly for now
      const res = await axios.post('http://localhost:5000/api/weeds/identify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(res.data);
    } catch (err) {
      console.error("Scan failed", err);
      setError("Could not identify plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setImgSrc(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="weed-identifier-container">
      <button className="back-icon" onClick={() => navigate('/')}>←</button>

      {/* Camera Feed */}
      {!imgSrc && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="camera-feed"
          videoConstraints={{ facingMode: "environment" }}
          onUserMediaError={handleUserMediaError}
        />
      )}

      {/* Captured Image Preview (frozen frame) */}
      {imgSrc && (
        <img src={imgSrc} alt="Captured" className="camera-feed" style={{ filter: 'brightness(0.5)' }} />
      )}

      {/* Overlay UI */}
      <div className="overlay-ui">
        {loading && <div className="loading-indicator">Analyzing Plant...</div>}
        {error && <div className="loading-indicator" style={{background: 'red'}}>{error}</div>}
        
        {!imgSrc && !loading && (
          <button className="scan-btn" onClick={capture} aria-label="Scan Plant"></button>
        )}
      </div>

      {/* Results Modal */}
      {result && (
        <div className="result-card">
          <div className="result-header">
            <div>
              <h2 className="weed-name">{result.name || "Unknown Plant"}</h2>
              <p className="scientific-name">{result.scientificName}</p>
            </div>
            <span className="confidence-badge">{result.confidence} Confidence</span>
          </div>

          <div className="result-body">
            <div className="section-title">🌱 Description</div>
            <p>{result.description}</p>

            <div className="section-title">⚠️ Is it a Weed?</div>
            <p>
              {result.isPlant === false 
                ? "No plant detected." 
                : result.isWeed 
                  ? "Yes, this is considered a weed." 
                  : "No, this might be a beneficial plant."
              }
            </p>

            {result.isWeed && (
              <>
                <div className="section-title">🛠️ Removal Instructions</div>
                <p>{result.removalInstructions}</p>
              </>
            )}

            {result.warning && (
               <div className="section-title" style={{color: '#d32f2f'}}>☣️ Warning</div>
            )}
            {result.warning && <p style={{color: '#d32f2f'}}>{result.warning}</p>}
          </div>

          <button className="close-btn" onClick={resetScan}>Scan Another</button>
        </div>
      )}
    </div>
  );
};

export default WeedIdentifier;

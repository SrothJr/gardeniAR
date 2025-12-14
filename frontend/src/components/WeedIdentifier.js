import React, { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";
import "./WeedIdentifier.css";

// Backend api
const api = "http://localhost:5000/api";

const WeedIdentifier = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // State
  const [mode, setMode] = useState("auto");
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Manual Mode State
  const [weeds, setWeeds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch locally saved Weeds
  useEffect(() => {
    axios
      .get(`${api}/weeds`)
      .then((res) => {
        setWeeds(res.data);
      })
      .catch((err) => console.error("Failed to load weeds", err));
  }, []);

  // Navigation for Manual
  const nextWeed = () => setCurrentIndex((prev) => (prev + 1) % weeds.length);
  const prevWeed = () =>
    setCurrentIndex((prev) => (prev - 1 + weeds.length) % weeds.length);

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

  // --- Camera & Upload Logic ---

  const handleUserMediaError = useCallback(() => {
    console.log("Rear camera not found, using default.");
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => identifyPlant(blob));
  }, [webcamRef]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImgSrc(e.target.result);
      reader.readAsDataURL(file);
      identifyPlant(file);
    }
  };

  const identifyPlant = async (imageBlobOrFile) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", imageBlobOrFile, "plant.jpg");

      const res = await axios.post(`${api}/weeds/identify`, formData, {
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

  const resetScan = () => {
    setImgSrc(null);
    setResult(null);
    setError(null);
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="weed-identifier-container">
      <button className="back-icon" onClick={() => navigate("/")}>
        ←
      </button>

      {/* Mode Toggle Switch */}
      {!imgSrc && !result && (
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === "auto" ? "active" : ""}`}
            onClick={() => setMode("auto")}
          >
            AI Scan
          </button>
          <button
            className={`mode-btn ${mode === "manual" ? "active" : ""}`}
            onClick={() => setMode("manual")}
          >
            Manual AR
          </button>
        </div>
      )}

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

      {/* Captured Image Preview */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt="Captured"
          className="camera-feed"
          style={{ filter: "brightness(0.5)", objectFit: "contain" }}
        />
      )}

      {/* --- AUTO MODE UI --- */}
      {mode === "auto" && (
        <div className="overlay-ui">
          {loading && (
            <div className="loading-indicator">Analyzing Plant...</div>
          )}
          {error && (
            <div className="loading-indicator" style={{ background: "red" }}>
              {error}
            </div>
          )}

          {!imgSrc && !loading && (
            <div className="controls-row">
              {/* Hidden Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: "none" }}
              />

              {/* Gallery Button */}
              <button className="icon-btn" onClick={triggerFileUpload}>
                🖼️
              </button>

              {/* Shutter Button */}
              <button
                className="scan-btn"
                onClick={capture}
                aria-label="Scan Plant"
              ></button>

              {/* Spacer to balance layout */}
              <div style={{ width: "50px" }}></div>
            </div>
          )}
        </div>
      )}

      {/* --- MANUAL MODE UI --- */}
      {mode === "manual" && !result && weeds.length > 0 && (
        <div className="manual-overlay-layer">
          {/* Ghost Image Overlay */}
          <div className="ghost-container">
            <img
              src={weeds[currentIndex].imageUrl}
              alt="Ghost Overlay"
              className="ghost-image"
            />
            <div className="ghost-guide-text">Align plant with overlay</div>
          </div>

          {/* Navigation Controls */}
          <div className="manual-controls">
            <button className="nav-btn" onClick={prevWeed}>
              ❮
            </button>
            <div className="weed-label">
              <h3>{weeds[currentIndex].name}</h3>
              <button className="match-btn" onClick={selectManualWeed}>
                It's a Match!
              </button>
            </div>
            <button className="nav-btn" onClick={nextWeed}>
              ❯
            </button>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {result && (
        <div className="result-card">
          <div className="result-header">
            <div>
              <h2 className="weed-name">{result.name || "Unknown Plant"}</h2>
              <p className="scientific-name">{result.scientificName}</p>
            </div>
            <span className="confidence-badge">
              {result.confidence || "Manual"}
            </span>
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
                : "No, this might be a beneficial plant."}
            </p>

            {result.isWeed && (
              <>
                <div className="section-title">🛠️ Removal Instructions</div>
                <p>{result.removalInstructions}</p>
              </>
            )}

            {result.warning && (
              <div className="section-title" style={{ color: "#d32f2f" }}>
                ☣️ Warning
              </div>
            )}
            {result.warning && (
              <p style={{ color: "#d32f2f" }}>{result.warning}</p>
            )}
          </div>

          <button className="close-btn" onClick={resetScan}>
            {mode === "auto" ? "Scan Another" : "Back to AR"}
          </button>
        </div>
      )}
    </div>
  );
};

export default WeedIdentifier;

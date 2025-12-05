import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="content-wrapper">
        <h1 className="app-title">
          Gardeni<span className="highlight">AR</span>
        </h1>
        <p className="subtitle">Your AI-Powered Gardening Assistant</p>

        <div className="card-grid">
          {/* Weed Detective Card */}
          <div className="feature-card" onClick={() => navigate("/identify")}>
            <div className="icon-circle">🌿</div>
            <h2>Weed Detective</h2>
            <p>Identify weeds instantly and get removal tips.</p>
            <button className="start-btn">Start Scan</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

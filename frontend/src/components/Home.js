import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="content-wrapper">
        <h1 className="app-title">Gardeni<span className="highlight">AR</span></h1>
        <p className="subtitle">Your AI-Powered Gardening Assistant</p>
        
        <div className="card-grid">
          {/* Weed Detective Card */}
          <div className="feature-card" onClick={() => navigate('/identify')}>
            <div className="icon-circle">🌿</div>
            <h2>Weed Detective</h2>
            <p>Identify weeds instantly and get removal tips.</p>
            <button className="start-btn">Start Scan</button>
          </div>

          {/* Placeholders for other group members' features */}
          <div className="feature-card disabled">
            <div className="icon-circle">💧</div>
            <h2>Soil Doctor</h2>
            <p>Coming Soon (Module 2)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

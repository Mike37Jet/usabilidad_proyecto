import React, { useState, useEffect } from 'react';
import './ListeningLevels.css';

interface ListeningLevelsProps {
  onNavigateBack: () => void;
  onLevelSelect: (level: number) => void;
  score: number;
  lives: number;
}

const ListeningLevels = ({ onNavigateBack, onLevelSelect, score: propScore, lives: propLives }: ListeningLevelsProps) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  // Actualizar desde localStorage al montar el componente
  useEffect(() => {
    const savedScore = localStorage.getItem('listeningScore');
    
    // Mantener el score guardado
    setScore(savedScore ? parseInt(savedScore) : propScore || 0);
    
    // Siempre restablecer las vidas a 3 cuando regreses a levels
    setLives(3);
    localStorage.setItem('listeningLives', '3');
  }, [propScore, propLives]);

  const levels = [1, 2, 3, 4, 5, 6];

  return (
    <div className="listening-levels-container">
      {/* Header */}
      <header className="listening-levels-header">
        <div className="header-logo">
          <img 
            src="logo_app.svg" 
            alt="English Club Logo" 
            className="header-logo-img"
          />
        </div>
        <h1 className="listening-levels-title">LISTENING</h1>
        <div className="user-profile">
          <div className="profile-avatar">
            <span className="profile-icon">👤</span>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="listening-levels-content">
        {/* Score y Lives */}
        <div className="game-stats">
          <div className="score-section">
            <span className="star-icon">⭐</span>
            <span className="score-text">Score: {score}</span>
          </div>
         
        </div>

        {/* Grid de niveles */}
        <div className="levels-grid">
          {levels.map((level) => (
            <div
              key={level}
              className={`level-card ${level === 1 ? 'available' : 'locked'}`}
              onClick={() => level === 1 && onLevelSelect(level)}
            >
              <span className="level-number">{level}</span>
            </div>
          ))}
        </div>

        <div className="bottom-section">
          <div className="navigation-section">
            <button onClick={onNavigateBack} className="back-button">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningLevels;
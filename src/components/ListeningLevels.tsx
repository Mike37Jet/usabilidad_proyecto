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
    
    setScore(savedScore ? parseInt(savedScore) : propScore || 0);
    setLives(3);
    localStorage.setItem('listeningLives', '3');
  }, [propScore, propLives]);

  const levels = [1, 2, 3, 4, 5, 6];

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const handleLevelSelect = (level: number) => {
    if (level === 1) {
      onLevelSelect(level);
    }
  };

  return (
    <div className="listening-levels-container">
      <header className="listening-levels-header" role="banner">
        <div className="header-logo">
          <img 
            src="logo_app.svg" 
            alt="English Club - Listening levels application" 
            className="header-logo-img"
            role="img"
            tabIndex={0}
          />
        </div>
        <h1 className="listening-levels-title">LISTENING</h1>
        <div className="user-profile">
          <div className="profile-avatar" role="img" aria-label="User profile" tabIndex={0}>
            <span className="profile-icon" aria-hidden="true">👤</span>
          </div>
        </div>
      </header>

      <main className="listening-levels-content" role="main">
        <section className="game-stats" aria-labelledby="game-stats-heading">
          <h2 id="game-stats-heading" className="sr-only">Game statistics</h2>
          
          <div className="score-section" role="status" aria-live="polite" tabIndex={0}>
            <span className="star-icon" aria-hidden="true" role="img">⭐</span>
            <span className="score-text" aria-label={`Current score: ${score} points`}>Score: {score}</span>
          </div>
        </section>

        <section className="levels-section" aria-labelledby="levels-heading">
          <h2 id="levels-heading" className="sr-only">Available listening levels</h2>
          
          <div className="levels-grid" role="grid" aria-label="Listening exercise levels">
            {levels.map((level) => {
              const isAvailable = level === 1;
              const ariaLabel = isAvailable 
                ? `Level ${level} - Available, click to start` 
                : `Level ${level} - Locked, complete previous levels to unlock`;

              return (
                <div
                  key={level}
                  className={`level-card ${isAvailable ? 'available' : 'locked'}`}
                  onClick={() => handleLevelSelect(level)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleLevelSelect(level))}
                  role="gridcell"
                  tabIndex={0}
                  aria-label={ariaLabel}
                  aria-disabled={!isAvailable}
                >
                  <span className="level-number" aria-hidden="true">{level}</span>
                  <span className="sr-only">
                    {isAvailable ? 'Available level' : 'Locked level'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <nav className="bottom-section" aria-label="Level navigation">
          <div className="navigation-section">
            <button 
              onClick={onNavigateBack}
              onKeyDown={(e) => handleKeyDown(e, onNavigateBack)}
              className="back-button"
              aria-label="Go back to listening lesson"
              tabIndex={0}
            >
              Back
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
};

export default ListeningLevels;
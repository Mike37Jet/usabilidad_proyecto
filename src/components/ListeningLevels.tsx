import React, { useState, useEffect } from 'react';
import { usePoints } from '../contexts/PointsContext.tsx';
import './ListeningLevels.css';

interface ListeningLevelsProps {
  onNavigateBack: () => void;
  onLevelSelect: (level: number) => void;
}

const ListeningLevels = ({ onNavigateBack, onLevelSelect }: ListeningLevelsProps) => {
  
  React.useEffect(() => {
    const handleGlobalShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        onNavigateBack();
      }
    };
    window.addEventListener('keydown', handleGlobalShortcut);
    return () => {
      window.removeEventListener('keydown', handleGlobalShortcut);
    };
  }, [onNavigateBack]);
  const { points } = usePoints();
  const [sessionPoints, setSessionPoints] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

 
  useEffect(() => {
    const savedSessionPoints = localStorage.getItem('listeningSessionPoints');
    setSessionPoints(savedSessionPoints ? parseInt(savedSessionPoints) : 0);
  }, []);


  useEffect(() => {
    const savedCompletedLevels = localStorage.getItem('completedLevels');
    setCompletedLevels(savedCompletedLevels ? JSON.parse(savedCompletedLevels) : []);
  }, []);

  const levels = [1, 2, 3, 4, 5, 6];

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };


  const isLevelAvailable = (level: number) => {
    if (level === 1) return true; 
    
   
    return completedLevels.includes(level - 1);
  };


  const isLevelCompleted = (level: number) => {
    return completedLevels.includes(level);
  };

  const handleLevelSelect = (level: number) => {
    if (isLevelAvailable(level)) {
      onLevelSelect(level);
    }
  };

  return (
    <div className="listening-levels-container">
      <header className="listening-levels-header" role="banner">
        <div className="header-logo">
          <img 
            src={process.env.PUBLIC_URL + "/logo_app.svg"} 
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
            <span className="score-text" aria-label={`Current points: ${points + sessionPoints} points`}>Points: {points + sessionPoints}</span>
          </div>

          {/* Mostrar progreso de niveles completados */}
          <div className="progress-section" tabIndex={0}>
            <span className="progress-text">Progress: {completedLevels.length}/{levels.length} levels completed</span>
          </div>
        </section>

        <section className="levels-section" aria-labelledby="levels-heading">
          <h2 id="levels-heading" className="sr-only">Available listening levels</h2>
          
          <div className="levels-grid" role="grid" aria-label="Listening exercise levels">
            {levels.map((level) => {
              const isAvailable = isLevelAvailable(level);
              const isCompleted = isLevelCompleted(level);
              
              let cardClass = 'level-card';
              let statusIcon = '';
              let statusText = '';
              
              if (isCompleted) {
                cardClass += ' completed';
                statusIcon = '✅';
                statusText = 'Completed';
              } else if (isAvailable) {
                cardClass += ' available';
                statusIcon = '🎯';
                statusText = 'Available';
              } else {
                cardClass += ' locked';
                statusIcon = '🔒';
                statusText = 'Locked';
              }

              const ariaLabel = isAvailable 
                ? `Level ${level} - ${statusText}, click to start` 
                : `Level ${level} - ${statusText}, complete level ${level - 1} to unlock`;

              return (
                <div
                  key={level}
                  className={cardClass}
                  onClick={() => handleLevelSelect(level)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleLevelSelect(level))}
                  role="gridcell"
                  tabIndex={0}
                  aria-label={ariaLabel}
                  aria-disabled={!isAvailable}
                  style={{ cursor: isAvailable ? 'pointer' : 'not-allowed' }}
                >
                  <div className="level-content">
                    <span className="level-number" aria-hidden="true">{level}</span>
                    <span className="level-status-icon" aria-hidden="true">{statusIcon}</span>
                  </div>
                  <span className="level-status-text">{statusText}</span>
                  <span className="sr-only">
                    {isCompleted ? 'Completed level' : isAvailable ? 'Available level' : 'Locked level'}
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
import React, { useState, useEffect } from 'react';
import { usePoints } from '../contexts/PointsContext.tsx';
import './ListeningLevels.css';

interface ListeningLevelsProps {
  onNavigateBack: () => void;
  onLevelSelect: (level: number) => void;
  videoId: number;
}

const ListeningLevels = ({ onNavigateBack, onLevelSelect, videoId }: ListeningLevelsProps) => {
  const { points } = usePoints();
  const [sessionPoints, setSessionPoints] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // Cargar puntos de sesión de listening desde localStorage (específico por video)
  useEffect(() => {
    const savedSessionPoints = localStorage.getItem(`listeningSessionPoints_video${videoId}`);
    setSessionPoints(savedSessionPoints ? parseInt(savedSessionPoints) : 0);
  }, [videoId]);

  // Cargar niveles completados desde localStorage (específico por video)
  useEffect(() => {
    const savedCompletedLevels = localStorage.getItem(`completedLevels_video${videoId}`);
    setCompletedLevels(savedCompletedLevels ? JSON.parse(savedCompletedLevels) : []);
  }, [videoId]);

  const levels = [1, 2, 3, 4, 5, 6];

  // Información de los videos (copiada del componente Listening)
  const videoInfo = {
    1: { title: "Past Simple in TV Series", color: "#4CAF50" },
    2: { title: "Grammar in Context", color: "#2196F3" },
    3: { title: "Real-Life Conversations", color: "#FF9800" }
  };

  const currentVideoInfo = videoInfo[videoId as keyof typeof videoInfo] || videoInfo[1];

  const handleKeyDown = (e: any, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  // Función para determinar si un nivel está disponible
  const isLevelAvailable = (level: number) => {
    if (level === 1) return true; // El primer nivel siempre está disponible
    
    // Un nivel está disponible si el nivel anterior ha sido completado
    return completedLevels.includes(level - 1);
  };

  // Función para determinar si un nivel está completado
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
            src="logo_app.svg" 
            alt="English Club - Listening levels application" 
            className="header-logo-img"
            role="img"
            tabIndex={0}
          />
        </div>
        <h1 className="listening-levels-title">LISTENING - {currentVideoInfo.title}</h1>
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
                  style={{ 
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    borderColor: isAvailable ? currentVideoInfo.color : undefined,
                    backgroundColor: isCompleted ? currentVideoInfo.color + '20' : undefined
                  }}
                >
                  <div className="level-content">
                    <span 
                      className="level-number" 
                      aria-hidden="true"
                      style={{ color: isAvailable ? currentVideoInfo.color : undefined }}
                    >
                      {level}
                    </span>
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
              style={{ backgroundColor: currentVideoInfo.color }}
            >
              Back to Video Selection
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
};

export default ListeningLevels;
import React from 'react';
import { usePoints } from '../contexts/PointsContext.tsx';
import './Dashboard.css';

interface DashboardProps {
  onLogout: () => void;
  onNavigateToReading: () => void;
  onNavigateToListening: () => void;
  onNavigateToGrammar: () => void;
}

const Dashboard = ({ onLogout, onNavigateToReading, onNavigateToListening, onNavigateToGrammar }: DashboardProps) => {

  const { points } = usePoints();

  const handleLogout = () => {
    console.log('Logout');
    onLogout();
  };

  const handleStartReading = () => {
    console.log('Start Reading');
    onNavigateToReading();
  };

  const handleStartSpeaking = () => {
    console.log('Start Grammar');
    onNavigateToGrammar();
  };

  const handleStartListening = () => {
    console.log('Start Listening');
    onNavigateToListening();
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  React.useEffect(() => {
    const handleGlobalShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && !e.shiftKey && !e.altKey) {
        if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          handleStartReading();
        } else if (e.key.toLowerCase() === 'g') {
          e.preventDefault();
          handleStartSpeaking();
        } else if (e.key.toLowerCase() === 'l') {
          e.preventDefault();
          handleStartListening();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalShortcut);
    return () => {
      window.removeEventListener('keydown', handleGlobalShortcut);
    };
  }, [handleStartListening, handleStartReading, handleStartSpeaking]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header" role="banner">
        <div className="header-logo">
          <img 
            src={process.env.PUBLIC_URL + "/logo_app.svg"} 
            alt="English Club - Basic English learning application" 
            className="header-logo-img"
            tabIndex={0}
          />
        </div>
        <button 
          onClick={handleLogout} 
          onKeyDown={(e) => handleKeyDown(e, handleLogout)}
          className="logout-button"
          aria-label="Log out and return to login page"
          type="button"
          tabIndex={0}
        >
          Log Out
        </button>
      </header>

      <main className="dashboard-content" role="main">
        <section className="score-section" aria-labelledby="score-heading">
          <h2 id="score-heading" className="sr-only">Your current points</h2>
          <div 
            className="score-card" 
            role="status" 
            aria-live="polite"
            tabIndex={0}
            aria-label={`Points information: You have ${points} points`}
          >
            <span className="score-icon" aria-hidden="true">🌟</span>
            <span className="score-text">Points</span>
            <span className="score-number" aria-label={`You have ${points} points`}>{points}</span>
          </div>
        </section>

        <section className="activities-section" aria-labelledby="activities-heading">
          <h2 id="activities-heading" className="sr-only">Available learning activities</h2>
          <div className="activities-grid" role="group">
            
            <article className="activity-card reading-card3" tabIndex={0}>
              <div className="activity-icon" aria-hidden="true" role="img">
                📖
              </div>
              <h3 className="activity-title">Reading</h3>
              <p className="activity-description">
                Improve your reading skills with simple texts, articles and basic vocabulary exercises.
              </p>
              <button 
                onClick={handleStartReading} 
                onKeyDown={(e) => handleKeyDown(e, handleStartReading)}
                className="activity-button reading-button"
                aria-describedby="reading-description"
                type="button"
                tabIndex={0}
              >
                Start Reading
              </button>
              <div id="reading-description" className="sr-only">
                Reading activity for basic English level
              </div>
            </article>

            <article className="activity-card grammar2-card" tabIndex={0}>
              <div className="activity-icon" aria-hidden="true" role="img">
                📝
              </div>
              <h3 className="activity-title">Grammar</h3>
              <p className="activity-description">
                Practice basic grammar with simple exercises and easy-to-understand explanations.
              </p>
              <button 
                onClick={handleStartSpeaking} 
                onKeyDown={(e) => handleKeyDown(e, handleStartSpeaking)}
                className="activity-button grammar-button"
                aria-describedby="grammar-description"
                type="button"
                tabIndex={0}
              >
                Start Grammar
              </button>
              <div id="grammar-description" className="sr-only">
                Grammar activity for basic English level
              </div>
            </article>

            <article className="activity-card reading2-card" tabIndex={0}>
              <div className="activity-icon" aria-hidden="true" role="img">
                🎧
              </div>
              <h3 className="activity-title">Listening</h3>
              <p className="activity-description">
                Develop your listening skills with slow audios, basic conversations and simple exercises.
              </p>
              <button 
                onClick={handleStartListening} 
                onKeyDown={(e) => handleKeyDown(e, handleStartListening)}
                className="activity-button listening-button"
                aria-describedby="listening-description"
                type="button"
                tabIndex={0}
              >
                Start Listening
              </button>
              <div id="listening-description" className="sr-only">
                Listening activity for basic English level
              </div>
            </article>

          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
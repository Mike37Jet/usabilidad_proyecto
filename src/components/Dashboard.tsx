import React from 'react';
import './Dashboard.css';

interface DashboardProps {
  onLogout: () => void;
  onNavigateToReading: () => void;
  onNavigateToListening: () => void;
  onNavigateToGrammar: () => void;
}

const Dashboard = ({ onLogout, onNavigateToReading, onNavigateToListening, onNavigateToGrammar }: DashboardProps) => {
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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-logo">
          <img 
            src="/logo_app.svg" 
            alt="English Club Logo" 
            className="header-logo-img"
          />
        </div>
        <button onClick={handleLogout} className="logout-button">
          Log out
        </button>
      </header>

      <div className="dashboard-content">
        <div className="score-section">
          <div className="score-card">
            <span className="score-icon">🌟</span>
            <span className="score-text">Score</span>
            <span className="score-number">500</span>
          </div>
        </div>

        <div className="activities-grid">
          <div className="activity-card ">
            <div className="activity-icon">
              📖
            </div>
            <h2 className="activity-title">Reading</h2>
            <p className="activity-description">
              Improve your reading comprehension with interactive texts, articles and vocabulary exercises adapted to your level.
            </p>
            <button onClick={handleStartReading} className="activity-button reading-button">
              Start Reading
            </button>
          </div>

          <div className="activity-card grammar2-card">
            <div className="activity-icon">
              🗣️
            </div>
            <h2 className="activity-title">Grammar</h2>
            <p className="activity-description">
              Practice your pronunciation and fluency with conversation exercises and real-time voice recognition
            </p>
            <button onClick={handleStartSpeaking} className="activity-button grammar-button">
              Start Speaking
            </button>
          </div>

          <div className="activity-card reading2-card">
            <div className="activity-icon">
              🎧
            </div>
            <h2 className="activity-title">Listening</h2>
            <p className="activity-description">
              Develop your listening skills with audio content, conversations and exercises with different accents
            </p>
            <button onClick={handleStartListening} className="activity-button listening-button">
              Start Listening
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
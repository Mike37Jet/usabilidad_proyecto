import React, { useState } from 'react';
import ListeningGame from './ListeningGame';
import './Listening.css';

interface ListeningProps {
  onNavigateBack: () => void;
  onNavigateToLevels: () => void;
}

const Listening = ({ onNavigateBack, onNavigateToLevels }: ListeningProps) => {

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
  const [currentSlide, setCurrentSlide] = useState(0);


  const listeningVideos = [
    {
      id: 1,
      title: "Past Simple in TV Series",
      description: "Listen to conversations from TV series and identify past simple tense usage. This listening exercise helps you understand natural speech patterns in entertainment contexts.",
      youtubeId: "4cdGAM7W06A",
      embedUrl: "https://www.youtube.com/embed/4cdGAM7W06A?si=T4v9nG7YjRSNI1Pu",
      duration: "5 questions",
      difficulty: "B1",
      color: "#4CAF50",
      topics: ["Past Simple", "TV Series", "Conversations"]
    },
    {
      id: 2,
      title: "Grammar in Context",
      description: "Advanced grammar patterns in natural English conversations. Focus on understanding complex grammatical structures in real-world communication scenarios.",
      youtubeId: "ObbTKxqHTkk",
      embedUrl: "https://www.youtube.com/embed/ObbTKxqHTkk?si=3lQCl4ib7aiXDoxk",
      duration: "5 questions", 
      difficulty: "B1",
      color: "#2196F3",
      topics: ["Modal Verbs", "Present Perfect", "Conditionals", "Phrasal Verbs"]
    },
    {
      id: 3,
      title: "Real-Life Conversations",
      description: "Authentic dialogues with natural rhythm and intonation patterns. Practice understanding spontaneous speech with various accents and speaking speeds.",
      youtubeId: "97fxGkWqBCc",
      embedUrl: "https://www.youtube.com/embed/97fxGkWqBCc?si=wy3epm--7p0Pa0dn",
      duration: "5 questions",
      difficulty: "B1", 
      color: "#FF9800",
      topics: ["Pronunciation", "Stress Patterns", "Intonation", "Linking Sounds"]
    }
  ];

  const handleLevelSelect = (levelId: number) => {
    onNavigateToLevels();
  };

  const handleKeyDown = (e: any, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const currentVideo = listeningVideos[currentSlide];

  return (
    <div className="listening-container">
      <header className="listening-header" role="banner">
        <div className="header-logo">
          <img 
            src={process.env.PUBLIC_URL + "/logo_app.svg"} 
            alt="English Club - Listening Exercises" 
            className="header-logo-img"
            tabIndex={0}
          />
        </div>
        <h1 className="listening-main-title" tabIndex={0}>LISTENING EXERCISES</h1>
        <div className="user-profile">
          <div className="profile-avatar" tabIndex={0}>
            <span className="profile-icon">👤</span>
          </div>
        </div>
      </header>

      <main className="listening-content">
        <article className="listening-card">
          <h2 className="lesson-title" tabIndex={0}>{currentVideo.title}</h2>
          <section className="video-description">
            <p className="description-text" tabIndex={0}>{currentVideo.description}</p>
            <div className="tags-section">
              <h3 tabIndex={0}>Listening Topics:</h3>
              <div className="tags-container" role="list" aria-label="Listening topics">
                {currentVideo.topics.map((topic, index) => (
                  <span key={index} className="tag" role="listitem" style={{ backgroundColor: currentVideo.color }} tabIndex={0}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="level-info-section">
              <div className="detail-item" tabIndex={0}>
                <span className="detail-icon">⏱️</span>
                <span className="detail-text">{currentVideo.duration}</span>
              </div>
              <div className="detail-item" tabIndex={0}>
                <span className="detail-icon">🎯</span>
                <span className="detail-text">{currentVideo.difficulty} Level</span>
              </div>
            </div>
          </section>
          <section className="video-container" aria-labelledby="video-heading">
            <h3 id="video-heading" className="sr-only" tabIndex={0}>Listening exercise video</h3>
            <div 
              className="video-frame"
              role="region"
              aria-label="Video player"
              tabIndex={0}
            >
              <iframe 
                width="100%" 
                height="315" 
                src={currentVideo.embedUrl}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="youtube-iframe"
              />
            </div>
            <div className="video-instructions" id="video-instructions">
              <h4 className="sr-only" tabIndex={0}>Video controls instructions</h4>
              <p className="sr-only" tabIndex={0}>
                Use YouTube player controls to play, pause, adjust volume, and enable captions.
                Use Tab to navigate between controls.
              </p>
            </div>
          </section>
          <nav className="slide-indicators" role="tablist" aria-label="Video selection">
            {listeningVideos.map((_, index) => (
              <button
                key={index}
                className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                onKeyDown={(e) => handleKeyDown(e, () => setCurrentSlide(index))}
                role="tab"
                aria-selected={index === currentSlide}
                aria-label={`Video ${index + 1}`}
                tabIndex={0}
                style={{ backgroundColor: index === currentSlide ? listeningVideos[index].color : '#D4B996' }}
              />
            ))}
          </nav>
          <nav className="navigation-buttons" aria-label="Lesson navigation">
            <button 
              onClick={onNavigateBack} 
              onKeyDown={(e) => handleKeyDown(e, onNavigateBack)}
              className="nav-button back-btn"
              aria-label="Go back to previous page"
              tabIndex={0}
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => handleLevelSelect(currentVideo.id)} 
              onKeyDown={(e) => handleKeyDown(e, () => handleLevelSelect(currentVideo.id))}
              className="nav-button start-btn"
              aria-label="Start listening exercises"
              tabIndex={0}
              style={{ backgroundColor: currentVideo.color }}
            >
              Start Level {currentVideo.id}
            </button>
          </nav>
        </article>
      </main>
    </div>
  );
};

export default Listening;
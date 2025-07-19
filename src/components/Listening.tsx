import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Listening.css';

interface ListeningProps {
  onNavigateBack: () => void;
  onNavigateToLevels: () => void;
}

const Listening = ({ onNavigateBack, onNavigateToLevels }: ListeningProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(9.58);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMouseMoveRef = useRef(0);

  // Función para ocultar controles después de 3 segundos
  const hideControlsAfterDelay = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  // Función mejorada para mostrar controles con throttling
  const showControlsTemporarily = () => {
    const now = Date.now();
    if (now - lastMouseMoveRef.current < 500) {
      return;
    }
    lastMouseMoveRef.current = now;

    setShowControls(true);
    if (isPlaying) {
      hideControlsAfterDelay();
    }
  };

  // Efecto para ocultar controles cuando empiece a reproducir
  useEffect(() => {
    if (isPlaying) {
      hideControlsAfterDelay();
    } else {
      setShowControls(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, hideControlsAfterDelay]);

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const handleVideoKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        handlePlayPause();
        break;
      case 'm':
        e.preventDefault();
        handleMuteToggle();
        break;
      case 'f':
        e.preventDefault();
        if (videoRef.current && document.fullscreenEnabled) {
          if (!document.fullscreenElement) {
            videoRef.current.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        skipTime(-10);
        break;
      case 'ArrowRight':
        e.preventDefault();
        skipTime(10);
        break;
      case 'ArrowUp':
        e.preventDefault();
        adjustVolume(0.1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        adjustVolume(-0.1);
        break;
      case 's':
        e.preventDefault();
        setShowSubtitles(!showSubtitles);
        break;
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const adjustVolume = (change: number) => {
    if (videoRef.current) {
      const newVolume = Math.max(0, Math.min(volume + change, 1));
      handleVolumeChange(newVolume);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Error playing video:', error);
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    onNavigateToLevels();
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.muted = false;
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      
      if (newVolume === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="listening-container">
      <header className="listening-header" role="banner">
        <div className="header-logo">
          <img 
            src="logo_app.svg" 
            alt="English Club - Listening lesson application" 
            className="header-logo-img"
            role="img"
            tabIndex={0}
          />
        </div>
        <h1 className="listening-main-title">LISTENING</h1>
        <div className="user-profile">
          <div className="profile-avatar" role="img" aria-label="User profile" tabIndex={0}>
            <span className="profile-icon" aria-hidden="true">👤</span>
          </div>
        </div>
      </header>

      <main className="listening-content" role="main">
        <article className="listening-card">
          <h2 className="lesson-title">Past Simple: How it's used in FRIENDS TV Series</h2>
          
          <section className="video-container" aria-labelledby="video-heading">
            <h3 id="video-heading" className="sr-only">Listening lesson video</h3>
            
            <div 
              className="video-frame"
              onMouseMove={showControlsTemporarily}
              onMouseLeave={() => {
                if (isPlaying) {
                  hideControlsAfterDelay();
                }
              }}
              role="region"
              aria-label="Video player"
            >
              <video 
                ref={videoRef}
                className="video-placeholder"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onKeyDown={handleVideoKeyDown}
                controls={false}
                onClick={showControlsTemporarily}
                aria-label="Past Simple grammar lesson from FRIENDS TV series"
                aria-describedby="video-description"
                tabIndex={0}
              >
                <source src="/serie_ingles.mp4" type="video/mp4" />
                {showSubtitles && (
                  <track
                    kind="subtitles"
                    src="/subtitles_en.vtt"
                    srcLang="en"
                    label="English subtitles"
                    default
                  />
                )}
                <p>Your browser does not support the video element. Please use a modern browser to view this content.</p>
              </video>

              <div id="video-description" className="sr-only">
                This video shows examples of Past Simple tense usage from the popular TV series FRIENDS, 
                helping you understand how this grammar structure is used in real conversations.
              </div>

              <div 
                className={`video-controls ${showControls ? 'show' : 'hide'}`}
                role="group"
                aria-label="Video controls"
              >
                <button 
                  className="control-btn prev-btn"
                  onClick={() => skipTime(-10)}
                  onKeyDown={(e) => handleKeyDown(e, () => skipTime(-10))}
                  aria-label="Go back 10 seconds"
                  tabIndex={0}
                >
                  ⏮
                </button>
                
                <button 
                  className="control-btn play-btn" 
                  onClick={handlePlayPause}
                  onKeyDown={(e) => handleKeyDown(e, handlePlayPause)}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  tabIndex={0}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                
                <button 
                  className="control-btn"
                  onClick={() => skipTime(10)}
                  onKeyDown={(e) => handleKeyDown(e, () => skipTime(10))}
                  aria-label="Go forward 10 seconds"
                  tabIndex={0}
                >
                  ⏭
                </button>
                
                <button 
                  className="control-btn volume-btn" 
                  onClick={handleMuteToggle}
                  onKeyDown={(e) => handleKeyDown(e, handleMuteToggle)}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  aria-pressed={isMuted}
                  tabIndex={0}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
                
                <div className="volume-control" role="group" aria-label="Volume control">
                  <label htmlFor="volume-slider" className="sr-only">Volume level</label>
                  <input
                    id="volume-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="volume-slider"
                    aria-label={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round((isMuted ? 0 : volume) * 100)}
                    tabIndex={0}
                  />
                </div>

                <button
                  className="control-btn subtitles-btn"
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  onKeyDown={(e) => handleKeyDown(e, () => setShowSubtitles(!showSubtitles))}
                  aria-label={showSubtitles ? 'Hide subtitles' : 'Show subtitles'}
                  aria-pressed={showSubtitles}
                  tabIndex={0}
                >
                  CC
                </button>
                
                <div className="time-progress" role="group" aria-label="Video progress">
                  <div 
                    className="progress-bar"
                    onClick={handleProgressClick}
                    role="slider"
                    aria-label="Video progress"
                    aria-valuemin={0}
                    aria-valuemax={Math.round(duration)}
                    aria-valuenow={Math.round(currentTime)}
                    aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        skipTime(-5);
                      } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        skipTime(5);
                      }
                    }}
                  >
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                      aria-hidden="true"
                    ></div>
                    <div 
                      className="progress-handle"
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                      aria-hidden="true"
                    ></div>
                  </div>
                  <div className="time-display" aria-live="polite" aria-label={`Current time: ${formatTime(currentTime)}, Total duration: ${formatTime(duration)}`}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
              </div>
            </div>

            <div className="video-instructions" id="video-instructions">
              <h4 className="sr-only">Video controls instructions</h4>
              <p className="sr-only">
                Use spacebar or K to play/pause, M to mute/unmute, S to toggle subtitles, F for fullscreen, 
                arrow keys to navigate and adjust volume. Use Tab to navigate between controls.
              </p>
            </div>
          </section>

          <nav className="navigation-buttons" aria-label="Lesson navigation">
            <button 
              onClick={onNavigateBack} 
              onKeyDown={(e) => handleKeyDown(e, onNavigateBack)}
              className="nav-button back-btn"
              aria-label="Go back to previous page"
              tabIndex={0}
            >
              Back
            </button>
            <button 
              onClick={handleNext} 
              onKeyDown={(e) => handleKeyDown(e, handleNext)}
              className="nav-button next-btn"
              aria-label="Start listening exercises"
              tabIndex={0}
            >
              Next
            </button>
          </nav>
        </article>
      </main>
    </div>
  );
};

export default Listening;
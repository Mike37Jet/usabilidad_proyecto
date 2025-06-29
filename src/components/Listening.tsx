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
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
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
    }, 3000); // 3 segundos
  }, [isPlaying]);

  // Función mejorada para mostrar controles con throttling
  const showControlsTemporarily = () => {
    const now = Date.now();
    // Throttle: solo procesar si han pasado más de 500ms desde el último evento
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
      // Mostrar controles cuando está pausado
      setShowControls(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    // Limpiar timeout al desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, hideControlsAfterDelay]); // Agregué hideControlsAfterDelay a las dependencias

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Error al reproducir video:', error);
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
    // Navegar a la pantalla de niveles de listening
    onNavigateToLevels();
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        // Desmutear
        videoRef.current.muted = false;
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        // Mutear
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      
      // Si el volumen es 0, considerar como muted
      if (newVolume === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  // Función para manejar el click en la barra de progreso
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Función para manejar el arrastre del handle
  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = Math.max(0, Math.min((clickX / rect.width) * duration, duration));
      
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="listening-container">
      {/* Header siguiendo el mismo patrón que Reading */}
      <header className="listening-header">
        <div className="header-logo">
          <img 
            src="logo_app.svg" 
            alt="English Club Logo" 
            className="header-logo-img"
          />
        </div>
        <h1 className="listening-main-title">LISTENING</h1>
        <div className="user-profile">
          <div className="profile-avatar">
            <span className="profile-icon">👤</span>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="listening-content">
        <div className="listening-card">
          <h2 className="lesson-title">Past Simple: How uses in FRIENDS TV Serie</h2>
          
          <div className="video-container">
            <div 
              className="video-frame"
              onMouseMove={showControlsTemporarily}
              onMouseLeave={() => {
                if (isPlaying) {
                  hideControlsAfterDelay();
                }
              }}
            >
              <video 
                ref={videoRef}
                className="video-placeholder"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls={false}
                onClick={showControlsTemporarily}
              >
                <source src="/serie_ingles.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento video.
              </video>

              {/* Controles de video */}
              <div className={`video-controls ${showControls ? 'show' : 'hide'}`}>
                <button className="control-btn prev-btn">⏮</button>
                <button className="control-btn play-btn" onClick={handlePlayPause}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button className="control-btn">⏭</button>
                <button className="control-btn volume-btn" onClick={handleMuteToggle}>
                  {isMuted ? '🔇' : '🔊'}
                </button>
                
                <div className="volume-control">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="volume-slider"
                  />
                </div>
                
                <div className="time-progress">
                  <div 
                    className="progress-bar"
                    onClick={handleProgressClick}
                    onMouseMove={(e) => {
                      if (e.buttons === 1) {
                        handleProgressDrag(e);
                      }
                    }}
                  >
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                    <div 
                      className="progress-handle"
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        
                        const handleMouseMove = (event: globalThis.MouseEvent) => {
                          const progressBar = document.querySelector('.progress-bar') as HTMLElement;
                          if (progressBar && videoRef.current) {
                            const rect = progressBar.getBoundingClientRect();
                            const clickX = event.clientX - rect.left;
                            const newTime = Math.max(0, Math.min((clickX / rect.width) * duration, duration));
                            videoRef.current.currentTime = newTime;
                            setCurrentTime(newTime);
                          }
                        };
                        
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    ></div>
                  </div>
                  <span className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="navigation-buttons">
            <button onClick={onNavigateBack} className="nav-button back-btn">
              Back
            </button>
            <button onClick={handleNext} className="nav-button next-btn">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listening;
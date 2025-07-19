import React, { useState, useRef, useEffect } from 'react';
import './ListeningGame.css';

interface ListeningGameProps {
  level: number;
  onBack: () => void;
  onComplete: (score: number) => void;
}

const ListeningGame = ({ 
  level, 
  onBack, 
  onComplete
}: ListeningGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('listeningScore');
    return savedScore ? parseInt(savedScore) : 0;
  });
  const [lives, setLives] = useState(() => {
    const savedLives = localStorage.getItem('listeningLives');
    return savedLives ? parseInt(savedLives) : 3;
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Guardar en localStorage cuando cambien score o lives
  useEffect(() => {
    localStorage.setItem('listeningScore', score.toString());
    window.dispatchEvent(new CustomEvent('listeningScoreChanged', { detail: score }));
  }, [score]);

  useEffect(() => {
    localStorage.setItem('listeningLives', lives.toString());
    window.dispatchEvent(new CustomEvent('listeningLivesChanged', { detail: lives }));
  }, [lives]);

  // Preguntas por nivel
  const questions = [
    {
      question: "Fred mentions that going to bed is fine but going out to party is fine too, which verb phrase does he use to express this idea?",
      audioSrc: "audio_level1_q1.mp3",
      options: [
        "to be great in bed",
        "stay comfortable", 
        "to be patient"
      ],
      correctAnswer: "stay comfortable"
    },
    {
      question: "What does Sarah suggest for dealing with stress?",
      audioSrc: "audio_level1_q2.mp3",
      options: [
        "Take deep breaths",
        "Exercise regularly",
        "Listen to music",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      question: "According to the conversation, what time does the meeting start?",
      audioSrc: "audio_level1_q3.mp3",
      options: [
        "9:00 AM",
        "9:30 AM",
        "10:00 AM",
        "10:30 AM"
      ],
      correctAnswer: "9:30 AM"
    },
    {
      question: "What is the main topic of the dialogue?",
      audioSrc: "audio_level1_q4.mp3",
      options: [
        "Travel plans",
        "Work schedule",
        "Weekend activities",
        "Health tips"
      ],
      correctAnswer: "Weekend activities"
    },
    {
      question: "How does John feel about the new project?",
      audioSrc: "audio_level1_q5.mp3",
      options: [
        "Excited",
        "Worried",
        "Confused",
        "Indifferent"
      ],
      correctAnswer: "Excited"
    }
  ];

  const currentQ = questions[currentQuestion];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [currentQuestion]);

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const handleAudioKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        handlePlayPause();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        skipTime(-5);
        break;
      case 'ArrowRight':
        e.preventDefault();
        skipTime(5);
        break;
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (!showResult) {
      setSelectedAnswer(answer);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer(null);
    setWrongAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setIsPlaying(false);
    setCurrentTime(0);
    localStorage.removeItem('listeningScore');
    localStorage.removeItem('listeningLives');
  };

  const handleNext = () => {
    if (showResult) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setWrongAnswer(null);
        setShowResult(false);
        setIsPlaying(false);
        setCurrentTime(0);
      } else {
        localStorage.removeItem('listeningScore');
        localStorage.removeItem('listeningLives');
        onComplete(score);
      }
    } else if (selectedAnswer) {
      if (selectedAnswer === currentQ.correctAnswer) {
        setScore(score + 1);
        setWrongAnswer(null);
      } else {
        setWrongAnswer(selectedAnswer);
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          setTimeout(() => {
            setGameOver(true);
          }, 1500);
          return;
        }
      }
      setShowResult(true);
    }
  };

  // Pantalla de Game Over
  if (gameOver) {
    return (
      <div className="listening-game-container">
        <header className="listening-game-header" role="banner">
          <div className="header-logo">
            <img 
              src="logo_app.svg" 
              alt="English Club - Listening game application" 
              className="header-logo-img"
              role="img"
              tabIndex={0}
            />
          </div>
          <h1 className="listening-game-title">LISTENING</h1>
          <div className="user-profile">
            <div className="profile-avatar" role="img" aria-label="User profile" tabIndex={0}>
              <span className="profile-icon" aria-hidden="true">👤</span>
            </div>
          </div>
        </header>

        <main className="listening-game-content" role="main">
          <section className="game-stats" aria-labelledby="final-stats-heading">
            <h2 id="final-stats-heading" className="sr-only">Final game statistics</h2>
            
            <div className="score-display" role="status" aria-live="polite" tabIndex={0}>
              <span className="score-icon" aria-hidden="true" role="img">⭐</span>
              <span className="score-text" aria-label={`Final score: ${score} points`}>SCORE {score}</span>
            </div>
            
            <div className="question-counter" tabIndex={0}>
              <h3>Question</h3>
              <p aria-label={`Question ${currentQuestion + 1} of ${questions.length}`}>{currentQuestion + 1}/{questions.length}</p>
            </div>
            
            <div className="lives-display" role="status" aria-label="No lives remaining" tabIndex={0}>
              {Array.from({ length: 3 }, (_, index) => (
                <span key={index} className="heart inactive" aria-hidden="true" role="img">
                  💔
                </span>
              ))}
            </div>
          </section>

          <section className="game-over-container" role="dialog" aria-labelledby="game-over-title" aria-describedby="game-over-message">
            <div className="game-over-modal">
              <h2 id="game-over-title" className="game-over-title">GAME OVER</h2>
              <p id="game-over-message" className="game-over-message">You have no lives left!</p>
              <div className="crying-emoji" aria-hidden="true" role="img">😭</div>
              
              <button 
                className="restart-button" 
                onClick={handleRestart}
                onKeyDown={(e) => handleKeyDown(e, handleRestart)}
                aria-label="Restart the listening game"
                tabIndex={0}
                autoFocus
              >
                Start again
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="listening-game-container">
      <header className="listening-game-header" role="banner">
        <div className="header-logo">
          <img 
            src="logo_app.svg" 
            alt="English Club - Listening game application" 
            className="header-logo-img"
            role="img"
            tabIndex={0}
          />
        </div>
        <h1 className="listening-game-title">LISTENING</h1>
        <div className="user-profile">
          <div className="profile-avatar" role="img" aria-label="User profile" tabIndex={0}>
            <span className="profile-icon" aria-hidden="true">👤</span>
          </div>
        </div>
      </header>

      <main className="listening-game-content" role="main">
        <section className="game-stats" aria-labelledby="game-stats-heading">
          <h2 id="game-stats-heading" className="sr-only">Current game statistics</h2>
          
          <div className="score-display" role="status" aria-live="polite" tabIndex={0}>
            <span className="score-icon" aria-hidden="true" role="img">⭐</span>
            <span className="score-text" aria-label={`Current score: ${score} points`}>Score: {score}</span>
          </div>
          
          <div className="lives-display" role="status" aria-live="polite" aria-label={`Lives remaining: ${lives} out of 3`} tabIndex={0}>
            {Array.from({ length: 3 }, (_, index) => (
              <span 
                key={index} 
                className={`heart ${index < lives ? 'active' : 'inactive'}`}
                aria-hidden="true"
                role="img"
              >
                {index < lives ? '❤️' : '💔'}
              </span>
            ))}
          </div>
        </section>

        <section className="question-container2" aria-labelledby="current-question-heading">
          <h2 id="current-question-heading" className="sr-only">Listening comprehension question</h2>
          
          <div className="question-header">
            <h3 className="question-counter">Question {currentQuestion + 1}/{questions.length}</h3>
          </div>

          

          <div className="question-content">
            <h4 className="question-text" id="current-question">{currentQ.question}</h4>
            
            <div className="answers-grid" role="radiogroup" aria-labelledby="current-question" aria-required="true">
              {currentQ.options.map((option, index) => {
                let buttonClass = 'answer-option';
                let ariaLabel = option;
                
                if (showResult) {
                  if (option === currentQ.correctAnswer) {
                    buttonClass += ' correct';
                    ariaLabel = `${option} - Correct answer`;
                  } else if (option === wrongAnswer) {
                    buttonClass += ' wrong';
                    ariaLabel = `${option} - Incorrect answer`;
                  }
                } else if (selectedAnswer === option) {
                  buttonClass += ' selected';
                  ariaLabel = `${option} - Selected`;
                }

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => handleAnswerSelect(option)}
                    onKeyDown={(e) => handleKeyDown(e, () => handleAnswerSelect(option))}
                    disabled={showResult}
                    role="radio"
                    aria-checked={selectedAnswer === option}
                    aria-label={ariaLabel}
                    tabIndex={0}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <nav className="game-buttons" aria-label="Game navigation">
          <button 
            onClick={onBack}
            onKeyDown={(e) => handleKeyDown(e, onBack)}
            className="back-button"
            aria-label="Go back to levels selection"
            tabIndex={0}
          >
            Back
          </button>
          <button 
            onClick={handleNext}
            onKeyDown={(e) => handleKeyDown(e, handleNext)}
            className="next-button"
            disabled={!selectedAnswer && !showResult}
            aria-label={showResult ? (currentQuestion < questions.length - 1 ? 'Go to next question' : 'Finish game') : 'Submit answer'}
            tabIndex={0}
          >
            {showResult ? (currentQuestion < questions.length - 1 ? 'Next' : 'Finish') : 'Submit'}
          </button>
        </nav>
      </main>
    </div>
  );
};

export default ListeningGame;
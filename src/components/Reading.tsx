import React, { useState, useEffect } from 'react';
import { usePoints } from '../contexts/PointsContext.tsx';
import './Reading.css';

interface ReadingProps {
  onBack: () => void;
}

const Reading = ({ onBack }: ReadingProps) => {
  const { points, addPoints } = usePoints();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sessionScore, setSessionScore] = useState(0); // Puntos de la sesión actual
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [totalTime] = useState(300);

  const readingContent = [
    {
      title: "The Island That Vanished",
      description: "This short reading explores the strange case of Sandy Island—a landmass that appeared on maps for over 100 years but was later proven not to exist. The story raises questions about cartography, data accuracy, and how easily errors can persist even in a high-tech world.",
      tags: ["#Geography", "#ScienceMysteries", "#CriticalThinking", "#Exploration"],
      fullText: `In the early 20th century, explorers charted a tiny island in the South Pacific, naming it Sandy Island. It appeared on nautical maps, was listed in scientific databases, and was even marked on Google Earth. However, in 2012, an Australian research team set out to study the island—only to discover that it didn't exist. When they arrived at the coordinates, all they found was open ocean. The mystery raised questions about how a nonexistent landmass could survive in official records for over a century.

Some believe the island's presence was the result of a cartographic mistake—perhaps a floating mass of pumice mistaken for land, or a simple error copied from one map to another over decades. Others speculate that it was a deliberate "trap street," a fictional location inserted by mapmakers to catch plagiarists. Regardless of the cause, the incident reminded the world that even in the digital age, not all information is accurate.

The case of Sandy Island reveals more than a mapping error; it underscores the importance of verifying data and the limits of human perception. In a world increasingly driven by satellite imagery and digital records, the disappearance of a fictional island serves as a strange yet powerful lesson: sometimes, the most reliable sources still need to be questioned.`
    }
  ];

  const questions = [
    {
      question: "What did the researchers find when they reached Sandy Island's coordinates?",
      options: [
        "A deserted beach",
        "A large mass of pumice", 
        "A military base",
        "Open Ocean"
      ],
      correctAnswer: "Open Ocean"
    },
    {
      question: "In what year did the Australian research team discover Sandy Island didn't exist?",
      options: [
        "2010",
        "2011",
        "2012",
        "2013"
      ],
      correctAnswer: "2012"
    },
    {
      question: "Where was Sandy Island supposedly located?",
      options: [
        "North Atlantic",
        "South Pacific",
        "Indian Ocean",
        "Mediterranean Sea"
      ],
      correctAnswer: "South Pacific"
    },
    {
      question: "What is a 'trap street' according to the text?",
      options: [
        "A street that leads nowhere",
        "A fictional location to catch plagiarists",
        "A dangerous road for drivers",
        "A mapping error"
      ],
      correctAnswer: "A fictional location to catch plagiarists"
    },
    {
      question: "How long did Sandy Island appear on maps before being proven false?",
      options: [
        "Over 50 years",
        "Over 75 years",
        "Over 100 years",
        "Over 150 years"
      ],
      correctAnswer: "Over 100 years"
    }
  ];

  // Efecto para el temporizador
  useEffect(() => {
    let interval: number;
    
    if (isPlaying && !isQuizMode && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !isQuizMode) {
      setIsPlaying(false);
      alert('Time is up! Please try again.');
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isPlaying, isQuizMode, timeRemaining]);

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleBackFromReading = () => {
    setIsPlaying(false);
    setIsQuizMode(false);
    setCurrentQuestion(0);
    setSessionScore(0);
    setLives(3);
    setSelectedAnswer(null);
    setWrongAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setTimeRemaining(totalTime);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setIsQuizMode(false);
    setCurrentQuestion(0);
    setSessionScore(0);
    setLives(3);
    setSelectedAnswer(null);
    setWrongAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setTimeRemaining(totalTime);
  };

  const handleNext = () => {
    if (isPlaying && !isQuizMode) {
      setIsQuizMode(true);
      setCurrentQuestion(0);
    } else if (isQuizMode && showResult) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setWrongAnswer(null);
        setShowResult(false);
      } else {
        // Quiz completado - agregar puntos totales al sistema global
        addPoints(sessionScore);
        alert(`Quiz completed! You earned ${sessionScore} points! Total points: ${points + sessionScore}`);
        handleRestart();
      }
    } else if (isQuizMode && selectedAnswer) {
      const currentQ = questions[currentQuestion];
      if (selectedAnswer === currentQ.correctAnswer) {
        const newSessionScore = sessionScore + 10; // 10 puntos por respuesta correcta
        setSessionScore(newSessionScore);
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

  const handleAnswerSelect = (answer: string) => {
    if (!showResult) {
      setSelectedAnswer(answer);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((totalTime - timeRemaining) / totalTime) * 100;
  const currentContent = readingContent[currentSlide];

  // Pantalla de preguntas (Quiz Mode)
  if (isQuizMode) {
    const currentQ = questions[currentQuestion];
    return (
      <div className="reading-container">
        <header className="reading-header" role="banner">
          <div className="header-logo">
            <img 
              src="logo_app.svg" 
              alt="English Club - Reading exercise application" 
              className="header-logo-img"
              role="img"
              tabIndex={0}
            />
          </div>
          <h1 className="reading-title">READING</h1>
          <div className="user-profile">
            <div className="profile-avatar" role="img" aria-label="User profile" tabIndex={0}>
              <span className="profile-icon" aria-hidden="true">👤</span>
            </div>
          </div>
        </header>

        <main className="quiz-content" role="main">
          <section className="quiz-header" aria-labelledby="quiz-status-heading">
            <h2 id="quiz-status-heading" className="sr-only">Quiz status and progress</h2>
            
            <div className="score-display" role="status" aria-live="polite" tabIndex={0}>
              <span className="score-icon" aria-hidden="true" role="img">⭐</span>
              <span className="score-text" aria-label={`Current points: ${points + sessionScore} points`}>Points: {points + sessionScore}</span>
            </div>
            
            <div className="question-counter" tabIndex={0}>
              <h3>Question</h3>
              <p aria-label={`Question ${currentQuestion + 1} of 5`}>{currentQuestion + 1}/5</p>
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

          <section className="question-container" aria-labelledby="current-question">
            <h3 id="current-question" className="question-text">{currentQ.question}</h3>
            
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
          </section>

          <div className="quiz-buttons">
            <button 
              onClick={handleBackFromReading} 
              onKeyDown={(e) => handleKeyDown(e, handleBackFromReading)}
              className="back-button"
              aria-label="Go back to reading selection"
              tabIndex={0}
            >
              Back
            </button>
            <button 
              onClick={handleNext} 
              onKeyDown={(e) => handleKeyDown(e, handleNext)}
              className="next-button"
              disabled={!selectedAnswer && !showResult}
              aria-label={showResult ? (currentQuestion < questions.length - 1 ? 'Go to next question' : 'Finish quiz') : 'Submit answer'}
              tabIndex={0}
            >
              {showResult ? (currentQuestion < questions.length - 1 ? 'Next' : 'Finish') : 'Submit'}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Si está en modo de juego (lectura), mostrar la pantalla de lectura
  if (isPlaying) {
    return (
      <div className="reading-container">
        <header className="reading-header" role="banner">
          <div className="header-logo">
            <img 
              src="logo_app.svg" 
              alt="English Club - Reading exercise application" 
              className="header-logo-img"
              role="img"
              tabIndex={0}
            />
          </div>
          <h1 className="reading-title">READING</h1>
          <div className="user-profile">
            <div className="profile-avatar" role="img" aria-label="User profile" tabIndex={0}>
              <span className="profile-icon" aria-hidden="true">👤</span>
            </div>
          </div>
        </header>

        <main className="reading-exercise-content" role="main">
          <section className="timer-section" aria-labelledby="timer-heading">
            <h2 id="timer-heading" className="sr-only">Reading timer</h2>
            <div className="timer-bar" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100} aria-label={`Reading progress: ${Math.round(progressPercentage)}% completed`}>
              <div 
                className="timer-progress" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="timer-display" aria-live="polite" aria-label={`Time remaining: ${formatTime(timeRemaining)}`}>
              {formatTime(timeRemaining)}
            </div>
          </section>

          <article className="reading-text-container">
            <h2 className="reading-exercise-title">{currentContent.title}</h2>
            <div className="reading-text" role="article" tabIndex={0}>
              {currentContent.fullText.split('\n\n').map((paragraph, index) => (
                <p key={index} className="reading-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <div className="reading-exercise-buttons">
            <button 
              onClick={handleBackFromReading} 
              onKeyDown={(e) => handleKeyDown(e, handleBackFromReading)}
              className="back-button"
              aria-label="Go back to reading selection"
              tabIndex={0}
            >
              Back
            </button>
            <button 
              onClick={handleNext} 
              onKeyDown={(e) => handleKeyDown(e, handleNext)}
              className="next-button"
              aria-label="Continue to quiz questions"
              tabIndex={0}
            >
              Start Quiz
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Pantalla de Game Over
  if (gameOver) {
    return (
      <div className="reading-container">
        <header className="reading-header" role="banner">
          <div className="header-logo">
            <img 
              src="logo_app.svg" 
              alt="English Club - Reading exercise application" 
              className="header-logo-img"
              role="img"
              tabIndex={0}
            />
          </div>
          <h1 className="reading-title">READING</h1>
          <div className="user-profile">
            <div className="profile-avatar" role="img" aria-label="User profile" tabIndex={0}>
              <span className="profile-icon" aria-hidden="true">👤</span>
            </div>
          </div>
        </header>

        <main className="reading-content" role="main">
          <section className="quiz-header" aria-labelledby="final-status-heading">
            <h2 id="final-status-heading" className="sr-only">Final quiz results</h2>
            
            <div className="score-display" role="status" aria-live="polite">
              <span className="score-icon" aria-hidden="true">⭐</span>
              <span className="score-text" aria-label={`Final points: ${points + sessionScore} points`}>POINTS {points + sessionScore}</span>
            </div>
            
            <div className="question-counter">
              <h3>Question</h3>
              <p>{currentQuestion + 1}/5</p>
            </div>
            
            <div className="lives-display" role="status" aria-label="No lives remaining">
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
                aria-label="Restart the reading exercise"
                tabIndex={0}
                autoFocus
              >
                Start Again
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Pantalla de selección original
  return (
    <div className="reading-container">
      <header className="reading-header" role="banner">
        <div className="header-logo">
          <img 
            src="logo_app.svg" 
            alt="English Club - Reading exercise application" 
            className="header-logo-img"
            role="img"
            tabIndex={0}
          />
        </div>
        <h1 className="reading-title">READING</h1>
        <div className="user-profile">
          <div className="profile-avatar" role="img" aria-label="User profile" tabIndex={0}>
            <span className="profile-icon" aria-hidden="true">👤</span>
          </div>
        </div>
      </header>

      <main className="reading-content" role="main">
        <article className="reading-card">
          <nav className="navigation-arrows" aria-label="Story navigation">
            <button 
              onClick={() => setCurrentSlide(currentSlide > 0 ? currentSlide - 1 : readingContent.length - 1)} 
              onKeyDown={(e) => handleKeyDown(e, () => setCurrentSlide(currentSlide > 0 ? currentSlide - 1 : readingContent.length - 1))}
              className="nav-arrow left-arrow"
              aria-label="Previous story"
              tabIndex={0}
            >
              ❮
            </button>
            <button 
              onClick={() => setCurrentSlide(currentSlide < readingContent.length - 1 ? currentSlide + 1 : 0)} 
              onKeyDown={(e) => handleKeyDown(e, () => setCurrentSlide(currentSlide < readingContent.length - 1 ? currentSlide + 1 : 0))}
              className="nav-arrow right-arrow"
              aria-label="Next story"
              tabIndex={0}
            >
              ❯
            </button>
          </nav>

          <section className="content-area">
            <div className="book-cover">
              <div className="book-image" role="img" aria-labelledby="book-title-overlay">
                <div id="book-title-overlay" className="book-title-overlay">
                  <h2>{currentContent.title}</h2>
                </div>
                <div className="book-illustration">
                  <img 
                    src="imagen_cuento.png" 
                    alt="Illustration of Sandy Island mystery - A mysterious island that appeared on maps but didn't exist" 
                    className="story-illustration"
                  />
                </div>
              </div>
            </div>

            <div className="content-description">
              <p className="description-text" tabIndex={0}>
                {currentContent.description}
              </p>
              
              <div className="tags-section">
                <h3>Learning Topics:</h3>
                <div className="tags-container" role="list" aria-label="Story topics">
                  {currentContent.tags.map((tag, index) => (
                    <span key={index} className="tag" role="listitem">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <nav className="slide-indicators" role="tablist" aria-label="Story selection">
            {readingContent.map((_, index) => (
              <button
                key={index}
                className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                onKeyDown={(e) => handleKeyDown(e, () => setCurrentSlide(index))}
                role="tab"
                aria-selected={index === currentSlide}
                aria-label={`Story ${index + 1}`}
                tabIndex={0}
              />
            ))}
          </nav>

          <div className="action-buttons">
            <button 
              onClick={onBack} 
              onKeyDown={(e) => handleKeyDown(e, onBack)}
              className="back-button"
              aria-label="Go back to main dashboard"
              tabIndex={0}
            >
              Back
            </button>
            <button 
              onClick={handlePlay} 
              onKeyDown={(e) => handleKeyDown(e, handlePlay)}
              className="play-button"
              aria-label="Start reading exercise"
              tabIndex={0}
            >
              Start Reading
            </button>
          </div>
        </article>
      </main>
    </div>
  );
};

export default Reading;
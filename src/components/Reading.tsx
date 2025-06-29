import React, { useState, useEffect } from 'react';
import './Reading.css';

interface ReadingProps {
  onBack: () => void;
}

const Reading = ({ onBack }: ReadingProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false); // Nuevo estado
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
      alert('Time is up!');
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isPlaying, isQuizMode, timeRemaining]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleBackFromReading = () => {
    setIsPlaying(false);
    setIsQuizMode(false);
    setCurrentQuestion(0);
    setScore(0);
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
    setScore(0);
    setLives(3);
    setSelectedAnswer(null);
    setWrongAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setTimeRemaining(totalTime);
  };

  const handleNext = () => {
    if (isPlaying && !isQuizMode) {
      // Pasar del modo lectura al modo quiz
      setIsQuizMode(true);
      setCurrentQuestion(0);
    } else if (isQuizMode && showResult) {
      // Avanzar a la siguiente pregunta después de mostrar el resultado
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setWrongAnswer(null);
        setShowResult(false);
      } else {
        // Quiz completado
        alert(`Quiz completed! Your final score: ${score}/${questions.length}`);
        handleRestart();
      }
    } else if (isQuizMode && selectedAnswer) {
      // Verificar respuesta y mostrar resultado
      const currentQ = questions[currentQuestion];
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
        <header className="reading-header">
          <div className="header-logo">
            <img 
              src="logo_app.svg" 
              alt="English Club Logo" 
              className="header-logo-img"
            />
          </div>
          <h1 className="reading-title">READING</h1>
          <div className="user-profile">
            <div className="profile-avatar">
              <span className="profile-icon">👤</span>
            </div>
          </div>
        </header>

        <div className="quiz-content">
          <div className="quiz-header">
            <div className="score-display">
              <span className="score-icon">⭐</span>
              <span className="score-text">Score: {score}</span>
            </div>
            
            <div className="question-counter">
              <h2>Question</h2>
              <p>{currentQuestion + 1}/5</p>
            </div>
            
            <div className="lives-display">
              {Array.from({ length: 3 }, (_, index) => (
                <span 
                  key={index} 
                  className={`heart ${index < lives ? 'active' : 'inactive'}`}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>

          <div className="question-container">
            <h3 className="question-text">{currentQ.question}</h3>
            
            <div className="answers-grid">
              {currentQ.options.map((option, index) => {
                let buttonClass = 'answer-option';
                
                if (showResult) {
                  if (option === currentQ.correctAnswer) {
                    buttonClass += ' correct';
                  } else if (option === wrongAnswer) {
                    buttonClass += ' wrong';
                  }
                } else if (selectedAnswer === option) {
                  buttonClass += ' selected';
                }

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showResult}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="quiz-buttons">
            <button onClick={handleBackFromReading} className="back-button">
              Back
            </button>
            <button 
              onClick={handleNext} 
              className="next-button"
              disabled={!selectedAnswer && !showResult}
            >
              {showResult ? (currentQuestion < questions.length - 1 ? 'Next' : 'Finish') : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si está en modo de juego (lectura), mostrar la pantalla de lectura
  if (isPlaying) {
    return (
      <div className="reading-container">
        <header className="reading-header">
          <div className="header-logo">
            <img 
              src="logo_app.svg" 
              alt="English Club Logo" 
              className="header-logo-img"
            />
          </div>
          <h1 className="reading-title">READING</h1>
          <div className="user-profile">
            <div className="profile-avatar">
              <span className="profile-icon">👤</span>
            </div>
          </div>
        </header>

        <div className="reading-exercise-content">
          <div className="timer-section">
            <div className="timer-bar">
              <div 
                className="timer-progress" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="timer-display">
              {formatTime(timeRemaining)}
            </div>
          </div>

          <div className="reading-text-container">
            <h2 className="reading-exercise-title">{currentContent.title}</h2>
            <div className="reading-text">
              {currentContent.fullText.split('\n\n').map((paragraph, index) => (
                <p key={index} className="reading-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="reading-exercise-buttons">
            <button onClick={handleBackFromReading} className="back-button">
              Back
            </button>
            <button onClick={handleNext} className="next-button">
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de Game Over
  if (gameOver) {
    return (
      <div className="reading-container">
        <header className="reading-header">
          <div className="header-logo">
            <img 
              src="logo_app.svg" 
              alt="English Club Logo" 
              className="header-logo-img"
            />
          </div>
          <h1 className="reading-title">READING</h1>
          <div className="user-profile">
            <div className="profile-avatar">
              <span className="profile-icon">👤</span>
            </div>
          </div>
        </header>

        <div className="reading-content">
          <div className="quiz-header">
            <div className="score-display">
              <span className="score-icon">⭐</span>
              <span className="score-text">SCORE {score}</span>
            </div>
            
            <div className="question-counter">
              <h2>Question</h2>
              <p>{currentQuestion + 1}/5</p>
            </div>
            
            <div className="lives-display">
              {Array.from({ length: 3 }, (_, index) => (
                <span key={index} className="heart inactive">
                  💔
                </span>
              ))}
            </div>
          </div>

          <div className="game-over-container">
            <div className="game-over-modal">
              <h2 className="game-over-title">GAME OVER</h2>
              <p className="game-over-message">You have no lives left!</p>
              <div className="crying-emoji">😭</div>
              
              <button className="restart-button" onClick={handleRestart}>
                Start again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de selección original
  return (
    <div className="reading-container">
      <header className="reading-header">
        <div className="header-logo">
          <img 
            src="logo_app.svg" 
            alt="English Club Logo" 
            className="header-logo-img"
          />
        </div>
        <h1 className="reading-title">READING</h1>
        <div className="user-profile">
          <div className="profile-avatar">
            <span className="profile-icon">👤</span>
          </div>
        </div>
      </header>

      <div className="reading-content">
        <div className="reading-card">
          <div className="navigation-arrows">
            <button onClick={() => setCurrentSlide(currentSlide > 0 ? currentSlide - 1 : readingContent.length - 1)} className="nav-arrow left-arrow">
              ❮
            </button>
            <button onClick={() => setCurrentSlide(currentSlide < readingContent.length - 1 ? currentSlide + 1 : 0)} className="nav-arrow right-arrow">
              ❯
            </button>
          </div>

          <div className="content-area">
            <div className="book-cover">
              <div className="book-image">
                <div className="book-title-overlay">
                  <h2>{currentContent.title}</h2>
                </div>
                <div className="book-illustration">
                  <img 
                    src="imagen_cuento.png" 
                    alt="El misterio de la Isla Sandy" 
                    className="story-illustration"
                  />
                </div>
              </div>
            </div>

            <div className="content-description">
              <p className="description-text">
                {currentContent.description}
              </p>
              
              <div className="tags-section">
                <h3>Tags:</h3>
                <div className="tags-container">
                  {currentContent.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="slide-indicators">
            {readingContent.map((_, index) => (
              <button
                key={index}
                className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          <div className="action-buttons">
            <button onClick={onBack} className="back-button">
              Back
            </button>
            <button onClick={handlePlay} className="play-button">
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reading;
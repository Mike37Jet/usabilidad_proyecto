import React, { useState, useEffect } from 'react';
import { usePoints } from '../contexts/PointsContext.tsx';
import './GrammarGame.css';

interface GrammarGameProps {
  level: number;
  videoQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  videoTitle: string;
  onBack: () => void;
  onComplete: (score: number) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  type: 'multiple-choice' | 'hangman';
  word?: string;
}

const GrammarGame = ({ level, videoQuestions, videoTitle, onBack, onComplete }: GrammarGameProps) => {
  const { points, addPoints } = usePoints();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [lives, setLives] = useState(3);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // Preguntas para el juego del ahorcado y múltiple opción
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);

  // Convertir las preguntas del video al formato requerido
  const questions: Question[] = (videoQuestions || []).map((q, index) => {
    const correctIndex = q.options.findIndex(option => option === q.correctAnswer);
    return {
      id: index + 1,
      question: q.question,
      options: q.options,
      correctAnswer: correctIndex,
      type: 'multiple-choice' as const
    };
  });

  // Si no hay preguntas disponibles, mostrar mensaje de error
  if (!videoQuestions || videoQuestions.length === 0 || questions.length === 0) {
    return (
      <div className="grammar-game-container">
        <header className="grammar-game-header">
          <h1>GRAMMAR GAME</h1>
        </header>
        <main className="grammar-game-content">
          <div className="error-message">
            <h2>No questions available</h2>
            <p>There are no questions loaded for this lesson.</p>
            <button onClick={onBack} className="back-button">
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const getCurrentHangmanWord = () => {
    return currentQ.word || 'SPELL';
  };

  const alphabet = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const currentQ = questions[currentQuestion];

  // Validación adicional para currentQ
  if (!currentQ) {
    return (
      <div className="grammar-game-container">
        <header className="grammar-game-header">
          <h1>GRAMMAR GAME</h1>
        </header>
        <main className="grammar-game-content">
          <div className="error-message">
            <h2>Question not found</h2>
            <p>The current question could not be loaded.</p>
            <button onClick={onBack} className="back-button">
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleKeyDown = (e: any, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (currentQ.type === 'multiple-choice' && !showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleLetterSelect = (letter: string) => {
    if (currentQ.type === 'hangman' && !selectedLetters.includes(letter)) {
      const newSelectedLetters = [...selectedLetters, letter];
      setSelectedLetters(newSelectedLetters);
      const currentWord = getCurrentHangmanWord();

      if (currentWord.includes(letter)) {
        const newGuessedLetters = [...guessedLetters, letter];
        setGuessedLetters(newGuessedLetters);
        
        // Verificar si la palabra está completa
        const wordComplete = currentWord.split('').every(l => newGuessedLetters.includes(l));
        if (wordComplete) {
          const newSessionPoints = sessionPoints + 10; // 10 puntos por palabra completada
          setSessionPoints(newSessionPoints);
          setTimeout(() => {
            handleNext();
          }, 1500);
        }
      } else {
        // Letra incorrecta
        const newLives = lives - 1;
        setLives(newLives);
        
        if (newLives <= 0) {
          setTimeout(() => {
            setGameOver(true);
          }, 1500);
        }
      }
    }
  };

  const handleNext = () => {
    if (currentQ.type === 'multiple-choice' && !showResult) {
      const correct = selectedAnswer === currentQ.correctAnswer;
      setShowResult(true);
      
      if (correct) {
        const newSessionPoints = sessionPoints + 10; // 10 puntos por respuesta correcta
        setSessionPoints(newSessionPoints);
      } else {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          setTimeout(() => {
            setGameOver(true);
          }, 1500);
          return;
        }
      }
      return;
    }

    // Avanzar a la siguiente pregunta
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setGuessedLetters([]);
      setSelectedLetters([]);
    } else {
      // Quiz completado - agregar puntos de sesión al sistema global
      addPoints(sessionPoints);
      setGameCompleted(true);
      onComplete(sessionPoints);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSessionPoints(0);
    setSelectedAnswer(null);
    setLives(3);
    setGameCompleted(false);
    setGameOver(false);
    setShowResult(false);
    setGuessedLetters([]);
    setSelectedLetters([]);
  };

  // Pantalla de Game Over
  if (gameOver) {
    return (
      <div className="grammar-game-container">
        <header className="grammar-game-header" role="banner">
          <div className="header-logo">
            <img 
              src="logo_app.svg" 
              alt="English Club - Grammar game application" 
              className="header-logo-img"
              role="img"
              tabIndex={0}
            />
          </div>
          <h1 className="grammar-game-title">GRAMMAR</h1>
          <h2 className="video-title">{videoTitle}</h2>
          <div className="user-profile">
            <div className="profile-avatar" role="img" aria-label="User profile" tabIndex={0}>
              <span className="profile-icon" aria-hidden="true">👤</span>
            </div>
          </div>
        </header>

        <main className="grammar-game-content" role="main">
          <section className="game-stats" aria-labelledby="final-stats-heading">
            <h2 id="final-stats-heading" className="sr-only">Final game statistics</h2>
            
            <div className="score-display" role="status" aria-live="polite" tabIndex={0}>
              <span className="star-icon" aria-hidden="true" role="img">⭐</span>
              <span className="score-text" aria-label={`Final points: ${points + sessionPoints} points`}>POINTS {points + sessionPoints}</span>
            </div>
            
            <div className="question-info2" tabIndex={0}>
              <h3>Level</h3>
              <p aria-label={`Question ${currentQuestion + 1} of ${questions.length}`}>{currentQuestion + 1}/{questions.length}</p>
            </div>

            <div className="lives-display" role="status" aria-label="No lives remaining" tabIndex={0}>
              {[...Array(3)].map((_, index) => (
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
              
              {currentQ.type === 'hangman' && (
                <div className="game-over-hangman">
                  <div className="game-over-word" aria-label={`The correct word was: ${getCurrentHangmanWord()}`}>
                    {getCurrentHangmanWord().split('').map((letter, index) => (
                      <span key={index} className="word-letter revealed">
                        {letter}
                      </span>
                    ))}
                  </div>
                  <div className="crying-emoji" aria-hidden="true" role="img">😭</div>
                </div>
              )}
              
              <button 
                className="restart-button" 
                onClick={handleRestart}
                onKeyDown={(e) => handleKeyDown(e, handleRestart)}
                aria-label="Restart the grammar game"
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

  const renderWord = () => {
    const currentWord = getCurrentHangmanWord();
    return currentWord.split('').map((letter, index) => (
      <span key={index} className="word-letter" aria-label={guessedLetters.includes(letter) ? letter : 'blank'}>
        {guessedLetters.includes(letter) ? letter : '_'}
      </span>
    ));
  };

  const renderHangman = () => {
    const currentWord = getCurrentHangmanWord();
    const wrongGuesses = selectedLetters.filter(letter => !currentWord.includes(letter)).length;
    
    const hangmanStages = [
      "Gallows only",
      "Head added",
      "Body added", 
      "Left arm added",
      "Right arm added",
      "Left leg added",
      "Complete figure - Game Over"
    ];

    const hangmanArt = [
      `   ┌───┐\n   │   │\n       │\n       │\n       │\n       │\n  ═════════`,
      `   ┌───┐\n   │   │\n   😵  │\n       │\n       │\n       │\n  ═════════`,
      `   ┌───┐\n   │   │\n   😵  │\n   │   │\n       │\n       │\n  ═════════`,
      `   ┌───┐\n   │   │\n   😵  │\n  ╱│   │\n       │\n       │\n  ═════════`,
      `   ┌───┐\n   │   │\n   😵  │\n  ╱│╲  │\n       │\n       │\n  ═════════`,
      `   ┌───┐\n   │   │\n   😵  │\n  ╱│╲  │\n  ╱    │\n       │\n  ═════════`,
      `   ┌───┐\n   │   │\n   💀  │\n  ╱│╲  │\n  ╱ ╲  │\n       │\n  ═════════`
    ];

    return (
      <div className="hangman-display" role="img" aria-labelledby="hangman-description">
        <div id="hangman-description" className="sr-only">
          Hangman drawing: {hangmanStages[Math.min(wrongGuesses, 6)]}
        </div>
        <pre className="hangman-art" aria-hidden="true">
          {hangmanArt[Math.min(wrongGuesses, 6)]}
        </pre>
        <div className="hangman-info">
          <p className="wrong-guesses" aria-live="polite">Wrong guesses: {wrongGuesses}/6</p>
          {wrongGuesses > 0 && (
            <p className="wrong-letters" aria-live="polite">
              Wrong letters: {selectedLetters.filter(letter => !currentWord.includes(letter)).join(', ')}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grammar-game-container">
      <header className="grammar-game-header" role="banner">
        <div className="header-logo">
          <img 
            src="logo_app.svg" 
            alt="English Club - Grammar game application" 
            className="header-logo-img"
            role="img"
            tabIndex={0}
          />
        </div>
        <h1 className="grammar-game-title">GRAMMAR</h1>
        <h2 className="video-title">{videoTitle}</h2>
        <div className="user-profile">
          <div className="profile-avatar" role="img" aria-label="User profile" tabIndex={0}>
            <span className="profile-icon" aria-hidden="true">👤</span>
          </div>
        </div>
      </header>

      <main className="grammar-game-content" role="main">
        <section className="game-stats" aria-labelledby="game-stats-heading">
          <h2 id="game-stats-heading" className="sr-only">Current game statistics</h2>
          
          <div className="score-display" role="status" aria-live="polite" tabIndex={0}>
            <span className="star-icon" aria-hidden="true" role="img">⭐</span>
            <span className="score-text" aria-label={`Current points: ${points + sessionPoints} points`}>Points: {points + sessionPoints}</span>
          </div>
          
          <div className="question-info2" tabIndex={0}>
            <h3>{currentQ.type === 'hangman' ? 'Level' : 'Question'}</h3>
            <p aria-label={`${currentQ.type === 'hangman' ? 'Level' : 'Question'} ${currentQuestion + 1} of ${questions.length}`}>
              {currentQuestion + 1}/{questions.length}
            </p>
          </div>

          <div className="lives-display" role="status" aria-live="polite" aria-label={`Lives remaining: ${lives} out of 3`} tabIndex={0}>
            {[...Array(3)].map((_, index) => (
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
          <h2 id="current-question-heading" className="sr-only">
            {currentQ.type === 'hangman' ? 'Word guessing game' : 'Multiple choice question'}
          </h2>
          
          {currentQ.type === 'hangman' ? (
            <div className="hangman-game">
              {renderHangman()}
              
              <div className="word-display" role="group" aria-labelledby="word-progress" aria-describedby="hangman-instruction">
                <div id="word-progress" className="sr-only">
                  Word progress: {getCurrentHangmanWord().split('').map(letter => 
                    guessedLetters.includes(letter) ? letter : 'blank'
                  ).join(' ')}
                </div>
                <div id="hangman-instruction" className="sr-only">
                  Guess the letters to complete the word: {getCurrentHangmanWord()}
                </div>
                {renderWord()}
              </div>
              
              <div className="keyboard" role="group" aria-label="Letter selection keyboard">
                {alphabet.map((row, rowIndex) => (
                  <div key={rowIndex} className="keyboard-row">
                    {row.map((letter) => {
                      const isSelected = selectedLetters.includes(letter);
                      const isCorrect = getCurrentHangmanWord().includes(letter);
                      let ariaLabel = `Letter ${letter}`;
                      
                      if (isSelected) {
                        ariaLabel += isCorrect ? ' - correct' : ' - incorrect';
                      }

                      return (
                        <button
                          key={letter}
                          className={`letter-btn ${
                            isSelected 
                              ? isCorrect 
                                ? 'correct' 
                                : 'wrong'
                              : ''
                          }`}
                          onClick={() => handleLetterSelect(letter)}
                          onKeyDown={(e) => handleKeyDown(e, () => handleLetterSelect(letter))}
                          disabled={isSelected}
                          aria-label={ariaLabel}
                          tabIndex={0}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <button 
                className="finish-btn" 
                onClick={handleNext}
                onKeyDown={(e) => handleKeyDown(e, handleNext)}
                aria-label="Finish this level and continue"
                tabIndex={0}
              >
                Finish
              </button>
            </div>
          ) : (
            <div className="multiple-choice-game">
              <div className="question-header">
                <h3 className="question-counter">Question {currentQuestion + 1}/{questions.length}</h3>
              </div>

              <div className="question-content">
                <div className="question-text" id="current-question">
                  {currentQ.question}
                </div>

                <div className="answers-grid" role="radiogroup" aria-labelledby="current-question" aria-required="true">
                  {(currentQ.options || []).map((option, index) => {
                    let buttonClass = 'answer-option';
                    let ariaLabel = option;
                    
                    if (showResult) {
                      if (index === currentQ.correctAnswer) {
                        buttonClass += ' correct';
                        ariaLabel = `${option} - Correct answer`;
                      } else if (selectedAnswer === index) {
                        buttonClass += ' wrong';
                        ariaLabel = `${option} - Incorrect answer`;
                      }
                    } else if (selectedAnswer === index) {
                      buttonClass += ' selected';
                      ariaLabel = `${option} - Selected`;
                    }

                    return (
                      <button
                        key={index}
                        className={buttonClass}
                        onClick={() => handleAnswerSelect(index)}
                        onKeyDown={(e) => handleKeyDown(e, () => handleAnswerSelect(index))}
                        disabled={showResult}
                        role="radio"
                        aria-checked={selectedAnswer === index}
                        aria-label={ariaLabel}
                        tabIndex={0}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        <nav className="game-buttons" aria-label="Game navigation">
          <button 
            onClick={onBack} 
            onKeyDown={(e) => handleKeyDown(e, onBack)}
            className="back-button"
            aria-label="Go back to previous page"
            tabIndex={0}
          >
            Back
          </button>
          {currentQ.type === 'multiple-choice' && (
            <button 
              onClick={handleNext} 
              onKeyDown={(e) => handleKeyDown(e, handleNext)}
              className="next-button"
              disabled={selectedAnswer === null && !showResult}
              aria-label={showResult ? 'Go to next question' : 'Submit answer'}
              tabIndex={0}
            >
              {showResult ? 'Next' : 'Submit'}
            </button>
          )}
        </nav>
      </main>
    </div>
  );
};

export default GrammarGame;
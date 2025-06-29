import React, { useState } from 'react';
import './GrammarGame.css';

interface GrammarGameProps {
  level: number;
  onBack: () => void;
  onComplete: (score: number) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  type: 'multiple-choice' | 'hangman';
  word?: string; // Para el juego del ahorcado
}

const GrammarGame = ({ level, onBack, onComplete }: GrammarGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [lives, setLives] = useState(3);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false); // Nuevo estado para Game Over
  
  // Preguntas para el juego del ahorcado y múltiple opción
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);

  const getCurrentHangmanWord = () => {
    return currentQ.word || 'SPELL';
  };

  const questions: Question[] = [
    {
      id: 1,
      question: "Complete the sentence: By next year, I ___ my studies.",
      options: ["will have finished", "will finish", "have finished", "will be finishing"],
      correctAnswer: 0,
      type: 'multiple-choice'
    },
    {
      id: 2,
      question: "Complete the word: F I N I S H E D",
      options: [],
      correctAnswer: 0,
      type: 'hangman',
      word: 'FINISHED'
    },
    {
      id: 3,
      question: "Which is the correct negative form?",
      options: [
        "She will not have completed the project",
        "She will not complete the project", 
        "She has not completed the project",
        "She will not completing the project"
      ],
      correctAnswer: 0,
      type: 'multiple-choice'
    },
    {
      id: 4,
      question: "Complete the word: C O M P L E T E D",
      options: [],
      correctAnswer: 0,
      type: 'hangman',
      word: 'COMPLETED'
    },
    {
      id: 5,
      question: "Which is the correct interrogative form?",
      options: [
        "Will you have studied English by tomorrow?",
        "Will you study English by tomorrow?",
        "Have you studied English by tomorrow?",
        "Are you studying English by tomorrow?"
      ],
      correctAnswer: 0,
      type: 'multiple-choice'
    }
  ];

  const alphabet = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const currentQ = questions[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    if (currentQ.type === 'multiple-choice') {
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
          // Palabra completada, avanzar automáticamente después de un breve delay
          setTimeout(() => {
            handleNext();
          }, 1500);
        }
      } else {
        // Letra incorrecta
        const wrongGuesses = newSelectedLetters.filter(l => !currentWord.includes(l)).length;
        const newLives = lives - 1;
        setLives(newLives);
        
        if (wrongGuesses >= 6 || newLives <= 0) {
          // Game over por demasiados errores o sin vidas
          setTimeout(() => {
            setGameOver(true);
          }, 1500);
        }
      }
    }
  };

  const handleNext = () => {
    let correct = false;

    if (currentQ.type === 'multiple-choice') {
      correct = selectedAnswer === currentQ.correctAnswer;
      if (!correct) {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          setGameOver(true);
          return;
        }
      }
    } else if (currentQ.type === 'hangman') {
      // Verificar si la palabra está completa
      const currentWord = getCurrentHangmanWord();
      const wordComplete = currentWord.split('').every(letter => guessedLetters.includes(letter));
      correct = wordComplete;
    }

    if (correct) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setGuessedLetters([]);
      setSelectedLetters([]);
    } else {
      setGameCompleted(true);
      onComplete(score + (correct ? 1 : 0));
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setLives(3);
    setGameCompleted(false);
    setGameOver(false);
    setGuessedLetters([]);
    setSelectedLetters([]);
  };

  // Pantalla de Game Over
  if (gameOver) {
    return (
      <div className="grammar-game-container">
        <header className="grammar-game-header">
          <div className="header-logo">
            <img 
              src="logo_app.svg" 
              alt="English Club Logo" 
              className="header-logo-img"
            />
          </div>
          <h1 className="grammar-game-title">GRAMMAR</h1>
          <div className="user-profile">
            <div className="profile-avatar">
              <span className="profile-icon">👤</span>
            </div>
          </div>
        </header>

        <div className="grammar-game-content">
          <div className="game-stats">
            <div className="score-display">
              <span className="star-icon">⭐</span>
              <span className="score-text">SCORE {score}</span>
            </div>
            
            <div className="question-info2">
              <h2>Level</h2>
              <p>{currentQuestion + 1}/{questions.length}</p>
            </div>

            <div className="lives-display">
              {[...Array(3)].map((_, index) => (
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
              
              {currentQ.type === 'hangman' && (
                <div className="game-over-hangman">
                  <div className="game-over-word">
                    {getCurrentHangmanWord().split('').map((letter, index) => (
                      <span key={index} className="word-letter revealed">
                        {letter}
                      </span>
                    ))}
                  </div>
                  <div className="crying-emoji">😭</div>
                </div>
              )}
              
              <button className="restart-button" onClick={handleRestart}>
                Start again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderWord = () => {
    const currentWord = getCurrentHangmanWord();
    return currentWord.split('').map((letter, index) => (
      <span key={index} className="word-letter">
        {guessedLetters.includes(letter) ? letter : '_'}
      </span>
    ));
  };

  const renderHangman = () => {
    const currentWord = getCurrentHangmanWord();
    const wrongGuesses = selectedLetters.filter(letter => !currentWord.includes(letter)).length;
    
    const hangmanStages = [
      // 0 errores - Solo la horca
      `
   ┌───┐
   │   │
       │
       │
       │
       │
  ═════════`,
      // 1 error - Cabeza
      `
   ┌───┐
   │   │
   😵  │
       │
       │
       │
  ═════════`,
      // 2 errores - Cuerpo
      `
   ┌───┐
   │   │
   😵  │
   │   │
       │
       │
  ═════════`,
      // 3 errores - Brazo izquierdo
      `
   ┌───┐
   │   │
   😵  │
  ╱│   │
       │
       │
  ═════════`,
      // 4 errores - Brazo derecho
      `
   ┌───┐
   │   │
   😵  │
  ╱│╲  │
       │
       │
  ═════════`,
      // 5 errores - Pierna izquierda
      `
   ┌───┐
   │   │
   😵  │
  ╱│╲  │
  ╱    │
       │
  ═════════`,
      // 6 errores - Pierna derecha (muerto)
      `
   ┌───┐
   │   │
   💀  │
  ╱│╲  │
  ╱ ╲  │
       │
  ═════════`
    ];

    return (
      <div className="hangman-display">
        <pre className="hangman-art">
          {hangmanStages[Math.min(wrongGuesses, 6)]}
        </pre>
        <div className="hangman-info">
          <p className="wrong-guesses">Wrong guesses: {wrongGuesses}/6</p>
          {wrongGuesses > 0 && (
            <p className="wrong-letters">
              Wrong letters: {selectedLetters.filter(letter => !currentWord.includes(letter)).join(', ')}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grammar-game-container">
      <header className="grammar-game-header">
        <div className="header-logo">
          <img 
            src="logo_app.svg" 
            alt="English Club Logo" 
            className="header-logo-img"
          />
        </div>
        <h1 className="grammar-game-title">GRAMMAR</h1>
        <div className="user-profile">
          <div className="profile-avatar">
            <span className="profile-icon">👤</span>
          </div>
        </div>
      </header>

      <div className="grammar-game-content">
        <div className="game-stats">
          <div className="score-display">
            <span className="star-icon">⭐</span>
            <span className="score-text">Score: {score}</span>
          </div>
          
          <div className="question-info2">
            <h2>{currentQ.type === 'hangman' ? 'Level' : 'Question'}</h2>
            <p>{currentQuestion + 1}/{questions.length}</p>
          </div>

          <div className="lives-display">
            {[...Array(3)].map((_, index) => (
              <span 
                key={index} 
                className={`heart ${index < lives ? 'active' : 'inactive'}`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>

        <div className="question-container2">
          {currentQ.type === 'hangman' ? (
            <div className="hangman-game">
              {renderHangman()}
              <div className="word-display">
                {renderWord()}
              </div>
              
              <div className="keyboard">
                {alphabet.map((row, rowIndex) => (
                  <div key={rowIndex} className="keyboard-row">
                    {row.map((letter) => (
                      <button
                        key={letter}
                        className={`letter-btn ${
                          selectedLetters.includes(letter) 
                            ? getCurrentHangmanWord().includes(letter) 
                              ? 'correct' 
                              : 'wrong'
                            : ''
                        }`}
                        onClick={() => handleLetterSelect(letter)}
                        disabled={selectedLetters.includes(letter)}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              <button className="finish-btn" onClick={handleNext}>
                Finish
              </button>
            </div>
          ) : (
            <div className="multiple-choice-game">
              <div className="question-header">
                <h2 className="question-counter">Question {currentQuestion + 1}/{questions.length}</h2>
              </div>

              <div className="question-content">
                <div className="question-text">
                  {currentQ.question}
                </div>

                <div className="answers-grid">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      className={`answer-option ${selectedAnswer === index ? 'selected' : ''}`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="game-buttons">
          <button onClick={onBack} className="back-button">
            Back
          </button>
          {currentQ.type === 'multiple-choice' && (
            <button 
              onClick={handleNext} 
              className="next-button"
              disabled={selectedAnswer === null}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrammarGame;
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
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false); // Nuevo estado
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  // Guardar en localStorage cuando cambien score o lives
  useEffect(() => {
    localStorage.setItem('listeningScore', score.toString());
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('listeningScoreChanged', { detail: score }));
  }, [score]);

  useEffect(() => {
    localStorage.setItem('listeningLives', lives.toString());
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('listeningLivesChanged', { detail: lives }));
  }, [lives]);

  // Preguntas por nivel (ejemplo para nivel 1)
  const questions = [
    {
      question: "Fred mentions that going to bed is fine but going out to party is fine too, which verb phrase do I use to express this doubt?",
      audioSrc: "audio_level1_q1.mp3", // Ruta del audio
      options: [
        "to be great in bed",
        "stay confort",
        "to be patient"
      ],
      correctAnswer: "stay confort"
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
    // Cargar audio cuando cambie la pregunta
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [currentQuestion]);




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
      // Avanzar a la siguiente pregunta después de mostrar el resultado
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setWrongAnswer(null);
        setShowResult(false);
        setIsPlaying(false);
        setCurrentTime(0);
      } else {
        // Quiz completado - limpiar localStorage solo al completar
        localStorage.removeItem('listeningScore');
        localStorage.removeItem('listeningLives');
        onComplete(score);
      }
    } else if (selectedAnswer) {
      // Verificar respuesta y mostrar resultado
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
        <header className="listening-game-header">
          <div className="header-logo">
            <img 
              src="logo_app.svg" 
              alt="English Club Logo" 
              className="header-logo-img"
            />
          </div>
          <h1 className="listening-game-title">LISTENING</h1>
          <div className="user-profile">
            <div className="profile-avatar">
              <span className="profile-icon">👤</span>
            </div>
          </div>
        </header>

        <div className="listening-game-content">
          <div className="game-stats">
            <div className="score-display">
              <span className="score-icon">⭐</span>
              <span className="score-text">SCORE {score}</span>
            </div>
            
            <div className="question-counter">
              <h2>Question</h2>
              <p>{currentQuestion + 1}/6</p>
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

  return (
    <div className="listening-game-container">
      <header className="listening-game-header">
        <div className="header-logo">
          <img 
            src="logo_app.svg" 
            alt="English Club Logo" 
            className="header-logo-img"
          />
        </div>
        <h1 className="listening-game-title">LISTENING</h1>
        <div className="user-profile">
          <div className="profile-avatar">
            <span className="profile-icon">👤</span>
          </div>
        </div>
      </header>

      <div className="listening-game-content">
        <div className="game-stats">
          <div className="score-display">
            <span className="score-icon">⭐</span>
            <span className="score-text">Score: {score}</span>
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

        <div className="question-container2">
          <div className="question-header">
            <h2 className="question-counter">Question {currentQuestion + 1}/6</h2>
          </div>


           

          {/* Pregunta */}
          <div className="question-content">
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
        </div>

        <div className="game-buttons">
          <button onClick={onBack} className="back-button">
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
};

export default ListeningGame;
import React, { useState, useEffect, useRef } from 'react';
import { usePoints } from '../contexts/PointsContext.tsx';
import './ListeningGame.css';

interface ListeningGameProps {
  level: number;
  onBack: () => void;
  onComplete: (score: number) => void;
  onBackToCategories: () => void;
}

const ListeningGame = ({
  level,
  onBack,
  onComplete,
  onBackToCategories
}: ListeningGameProps) => {
  const { points, addCategoryPoints } = usePoints();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);


  useEffect(() => {
    const savedSessionPoints = localStorage.getItem('listeningSessionPoints');
    setSessionPoints(savedSessionPoints ? parseInt(savedSessionPoints) : 0);
  }, []);


  useEffect(() => {
    localStorage.setItem('listeningSessionPoints', sessionPoints.toString());
  }, [sessionPoints]);

  const levelData = {
    1: {
      audioSrc: process.env.PUBLIC_URL + "/audio/level1_q1.mp3", 
      questions: [
        {
          question: "What does the speaker use to secure themselves to their sleeping bag in space?",
          options: [
            "Velcro straps",
            "Bungee cords",
            "Safety harnesses",
            "Magnetic clips"
          ],
          correctAnswer: "Bungee cords"
        },
        {
          question: "According to the speaker, where do astronauts sleep during boat missions?",
          options: [
            "In private cabins",
            "In the airlock or using a camp-like setup",
            "In the command center",
            "In rotating shifts"
          ],
          correctAnswer: "In the airlock or using a camp-like setup"
        },
        {
          question: "What does the speaker say about adjusting to sleep in space for short-term missions?",
          options: [
            "It's very easy to adapt",
            "It's very difficult to adjust",
            "It requires special medication",
            "It depends on the person"
          ],
          correctAnswer: "It's very difficult to adjust"
        },
        {
          question: "How does the speaker describe sleeping on the space station compared to boat missions?",
          options: [
            "Much more uncomfortable",
            "Exactly the same",
            "More comfortable with your own small closet space",
            "Requires more equipment"
          ],
          correctAnswer: "More comfortable with your own small closet space"
        },
        {
          question: "What does the speaker say about long-term adaptation to sleeping in space?",
          options: [
            "It never becomes natural",
            "It seems very natural",
            "It requires constant medication",
            "It gets progressively worse"
          ],
          correctAnswer: "It seems very natural"
        }
      ]
    },
    2: {
      audioSrc: process.env.PUBLIC_URL + "/audio/level2.mp3", 
      questions: [
        {
          question: "According to the speaker, what is a problem with most video games?",
          options: [
            "They have too many bugs",
            "They are expensive to make",
            "They are created from a male perspective",
            "They are not fun to play"
          ],
          correctAnswer: "They are created from a male perspective"
        },
        {
          question: "Why is creating games from a male perspective considered bad by the speaker?",
          options: [
            "It makes the games too long",
            "It is unnecessary and not inclusive",
            "It reduces the difficulty",
            "It lowers the graphics quality"
          ],
          correctAnswer: "It is unnecessary and not inclusive"
        },
        {
          question: "How does the speaker describe the portrayal of female characters?",
          options: [
            "Realistic and relatable",
            "Always heroic",
            "Sexualized from a male perspective",
            "Strong and independent"
          ],
          correctAnswer: "Sexualized from a male perspective"
        },
        {
          question: "What solution does the speaker suggest to make games more inclusive?",
          options: [
            "Reduce the budget",
            "Hire more male developers",
            "Use simpler mechanics",
            "Have a more diverse development team"
          ],
          correctAnswer: "Have a more diverse development team"
        },
        {
          question: "What does the speaker say about the future of stereotypical video games like Hector’s?",
          options: [
            "They will disappear completely",
            "They will only be for kids",
            "There is still an audience for them",
            "They will be banned"
          ],
          correctAnswer: "There is still an audience for them"
        }
      ]
    },
    3: {
      audioSrc: process.env.PUBLIC_URL + "/audio/level3.mp3", // Un solo audio para todo el nivel 3
      questions: [
        {
          question: "How does the speaker feel about working in Antarctica?",
          options: [
            "She is thrilled to be there.",
            "She has mixed feelings.",
            "She needs a lot of persuasion to commit to going there.",
            "She dislikes it entirely."
          ],
          correctAnswer: "She has mixed feelings."
        },
        {
          question: "How does she feel about Antarctic summers?",
          options: [
            "She resents not being able to go outside without protective gear.",
            "Occasionally it can be very pleasant.",
            "She can regularly be seen wearing a T-shirt outside.",
            "She never goes outside during summer."
          ],
          correctAnswer: "Occasionally it can be very pleasant."
        },
        {
          question: "What is the main research focus mentioned by the speaker?",
          options: [
            "Climate change effects",
            "Wildlife behavior",
            "Ice formation patterns",
            "Weather systems"
          ],
          correctAnswer: "Climate change effects"
        },
        {
          question: "How long is a typical research season in Antarctica?",
          options: [
            "3 months",
            "6 months",
            "9 months",
            "1 year"
          ],
          correctAnswer: "6 months"
        },
        {
          question: "What does the speaker find most challenging about Antarctic life?",
          options: [
            "The extreme cold",
            "Limited communication",
            "Isolation from family",
            "Equipment maintenance"
          ],
          correctAnswer: "Isolation from family"
        }
      ]
    },
    4: {
      audioSrc: process.env.PUBLIC_URL + "/audio/level4.mp3",
      questions: [
        {
          question: "What topic is the speaker discussing in this audio?",
          options: [
            "Marine conservation",
            "Curatorial work at a museum",
            "History of Napoleonic wars",
            "Fashion design education"
          ],
          correctAnswer: "Curatorial work at a museum"
        },
        {
          question: "What is one object the speaker researched recently?",
          options: [
            "A medieval tapestry",
            "A Napoleonic metal cabinet",
            "A Roman statue",
            "An Egyptian coffin"
          ],
          correctAnswer: "A Napoleonic metal cabinet"
        },
        {
          question: "What did the speaker study to prepare for her current job?",
          options: [
            "Museum management",
            "Art restoration",
            "History of design",
            "Fashion marketing"
          ],
          correctAnswer: "History of design"
        },
        {
          question: "What does the speaker say about working with objects in the collection?",
          options: [
            "They are often too damaged to study.",
            "They don't offer new insights after being studied.",
            "They always reveal something unexpected.",
            "They are only accessible to senior staff."
          ],
          correctAnswer: "They always reveal something unexpected."
        },
        {
          question: "How does the museum support students interested in curatorial work?",
          options: [
            "By offering full-time jobs directly",
            "Through guided tours only",
            "By providing internships and educational appointments",
            "By offering online courses only"
          ],
          correctAnswer: "By providing internships and educational appointments"
        }
      ]
    },
    5: {
      audioSrc: process.env.PUBLIC_URL + "/audio/level5.mp3",
      questions: [
        {
          question: "What are Frank's feelings about driving?",
          options: [
            "Driving is a pleasure he doesn’t want to give up.",
            "He treats driving as a way of keeping young.",
            "He feels that having to pay attention to where he’s going takes all the fun out of it.",
            "He is becoming more concerned about the dangers involved."
          ],
          correctAnswer: "He feels that having to pay attention to where he’s going takes all the fun out of it."
        },
        {
          question: "How does Roy show that he feels the same as Frank?",
          options: [
            "He agrees that the over 80’s are considered by many to be insignificant.",
            "He is as proud as Frank of having reached this age.",
            "He senses that there is very little left for them to do in their lives.",
            "He shares the opinion about driving not being a suitable activity after a certain age."
          ],
          correctAnswer: "He shares the opinion about driving not being a suitable activity after a certain age."
        },
        {
          question: "What advice does Frank give Roy?",
          options: [
            "To look for someone to accompany him when he drives.",
            "To cut down dramatically on something he has been doing extensively.",
            "To move because life on a farm is safer.",
            "To feel proud of getting to be 80."
          ],
          correctAnswer: "To cut down dramatically on something he has been doing extensively."
        },
        {
          question: "What reflections about Frank does Roy put forward?",
          options: [
            "That he lives an extremely carefree life.",
            "That he ought to take his life more seriously.",
            "That he would be happier with a pet.",
            "That he needs to have closer ties with his family."
          ],
          correctAnswer: "That he lives an extremely carefree life."
        },
        {
          question: "What regrets does Roy express?",
          options: [
            "That he lost contact with many people he used to know.",
            "That he allows his previous habits to prevent him from enjoying his present circumstances.",
            "That he didn’t travel as extensively as Frank.",
            "That he let petty quarrels affect his family relationships."
          ],
          correctAnswer: "That he allows his previous habits to prevent him from enjoying his present circumstances."
        }
      ]
    },

    6: {
      audioSrc: process.env.PUBLIC_URL + "/audio/level6.mp3",
      questions: [
        {
          question: "What is the speaker mainly talking about?",
          options: [
            "A new technology center",
            "A community center and its services",
            "A private school for teenagers",
            "A political campaign in the city"
          ],
          correctAnswer: "A community center and its services"
        },
        {
          question: "What challenge does the center face when planning dance classes for youth?",
          options: [
            "Lack of qualified teachers",
            "Limited funding for new programs",
            "Difficulty in choosing a style teens would enjoy",
            "Low attendance from parents"
          ],
          correctAnswer: "Difficulty in choosing a style teens would enjoy"
        },
        {
          question: "What is one reason people take evening language classes?",
          options: [
            "To work with local government",
            "To prepare for travel",
            "To start their own business",
            "To emigrate and find better job opportunities"
          ],
          correctAnswer: "To emigrate and find better job opportunities"
        },
        {
          question: "Why is the after-school program helpful for parents?",
          options: [
            "It provides tutoring and daycare all day",
            "It allows children to wait safely until picked up",
            "It serves free meals and transportation",
            "It teaches students how to use computers only"
          ],
          correctAnswer: "It allows children to wait safely until picked up"
        },
        {
          question: "What issue is mentioned regarding housing in the area?",
          options: [
            "The housing market is declining rapidly",
            "Most homes are being converted to schools",
            "Prices are rising while incomes remain low",
            "People are refusing to sell their properties"
          ],
          correctAnswer: "Prices are rising while incomes remain low"
        }
      ]
    }
  };

  const currentLevelData = levelData[level as keyof typeof levelData] || levelData[1];
  const questions = currentLevelData.questions;
  const currentQ = questions[currentQuestion];

  // Cargar audio solo una vez por nivel (no cambiar entre preguntas)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [level]); // Solo cambiar cuando cambie el nivel, no la pregunta

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
    setSessionPoints(0);
    setLives(3);
    setSelectedAnswer(null);
    setWrongAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setIsPlaying(false);
    setCurrentTime(0);
    localStorage.removeItem('listeningSessionPoints');
  };

  const handleNext = () => {
    if (showResult) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setWrongAnswer(null);
        setShowResult(false);

      } else {

        const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
        if (!completedLevels.includes(level)) {
          completedLevels.push(level);
          localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
        }


        addCategoryPoints('listening', sessionPoints);
        localStorage.removeItem('listeningSessionPoints');
        onComplete(sessionPoints);
      }
    } else if (selectedAnswer) {
      if (selectedAnswer === currentQ.correctAnswer) {
        const newSessionPoints = sessionPoints + 10; 
        setSessionPoints(newSessionPoints);
        setWrongAnswer(null);
      } else {
        setWrongAnswer(selectedAnswer);
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
 
          addCategoryPoints('listening', sessionPoints);
          setTimeout(() => {
            setGameOver(true);
          }, 1500);
          return;
        }
      }
      setShowResult(true);
    }
  };


  if (gameOver) {
    return (
      <div className="listening-game-container">
        <header className="listening-game-header" role="banner">
          <div className="header-logo">
            <img
              src={process.env.PUBLIC_URL + "/logo_app.svg"}
              alt="English Club - Listening game application"
              className="header-logo-img"
              role="img"
              tabIndex={0}
            />
          </div>
          <h1 className="listening-game-title" tabIndex={0}>LISTENING - LEVEL {level}</h1>
          <div className="user-profile">
            <div className="profile-avatar" role="img" aria-label="User profile" tabIndex={0}>
              <span className="profile-icon" aria-hidden="true">👤</span>
            </div>
          </div>
        </header>

        <main className="listening-game-content" role="main">
          <section className="game-stats" aria-labelledby="final-stats-heading">
            <h2 id="final-stats-heading" className="sr-only" tabIndex={0}>Final game statistics</h2>
            <div className="score-display" role="status" aria-live="polite" tabIndex={0}>
              <span className="star-icon" aria-hidden="true" role="img">⭐</span>
              <span className="score-text" aria-label={`Final points: ${sessionPoints} points`} tabIndex={0}>POINTS {sessionPoints}</span>
            </div>
            <div className="question-counter" tabIndex={0}>
              <h3 tabIndex={0}>Question</h3>
              <p aria-label={`Question ${currentQuestion + 1} of ${questions.length}`} tabIndex={0}>{currentQuestion + 1}/{questions.length}</p>
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
              <h2 id="game-over-title" className="game-over-title" tabIndex={0}>GAME OVER</h2>
              <p id="game-over-message" className="game-over-message" tabIndex={0}>You have no lives left!</p>
              <div className="crying-emoji" aria-hidden="true" role="img">😭</div>
              <button
                className="restart-button"
                onClick={handleRestart}
                onKeyDown={(e) => handleKeyDown(e, handleRestart)}
                aria-label="Restart the listening exercise"
                tabIndex={0}
                autoFocus
              >
                Start Again
              </button>
              <button
                className="back-to-categories-button"
                onClick={onBackToCategories}
                onKeyDown={(e) => handleKeyDown(e, onBackToCategories)}
                aria-label="Go back to categories selection"
                tabIndex={0}
              >
                Back to Categories
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
        <div className="header-logo" tabIndex={0}>
          <img
            src={process.env.PUBLIC_URL + "/logo_app.svg"}
            alt="English Club - Listening game application"
            className="header-logo-img"
            role="img"
          />
        </div>
        <h1 className="listening-game-title" tabIndex={0}>LISTENING - LEVEL {level}</h1>
        <div className="user-profile">
          <div className="profile-avatar" role="img" aria-label="User profile" tabIndex={0}>
            <span className="profile-icon" aria-hidden="true">👤</span>
          </div>
        </div>
      </header>

      <main className="listening-game-content" role="main">
        <section className="game-stats" aria-labelledby="game-stats-heading">
          <h2 id="game-stats-heading" className="sr-only" tabIndex={0}>Current game statistics</h2>
          <div className="score-display" role="status" aria-live="polite" tabIndex={0}>
            <span className="star-icon" aria-hidden="true" role="img">⭐</span>
            <span className="score-text" aria-label={`Current points: ${sessionPoints} points`} tabIndex={0}>Points: {sessionPoints}</span>
          </div>
          <div className="question-counter" tabIndex={0}>
            <h3 tabIndex={0}>Question</h3>
            <p aria-label={`Question ${currentQuestion + 1} of ${questions.length}`} tabIndex={0}>{currentQuestion + 1}/{questions.length}</p>
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
          <h2 id="current-question-heading" className="sr-only" tabIndex={0}>Listening exercise question</h2>
          <div className="audio-player" role="group" aria-labelledby="audio-controls" tabIndex={0}>
            <h3 id="audio-controls" className="sr-only" tabIndex={0}>Audio player controls</h3>
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              preload="metadata"
            >
              <source src={currentLevelData.audioSrc} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className="audio-controls" onKeyDown={handleAudioKeyDown} tabIndex={0}>
              <button
                onClick={handlePlayPause}
                className="play-pause-btn"
                aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                tabIndex={0}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <div className="time-display" aria-live="polite" tabIndex={0}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <button
                onClick={() => skipTime(-5)}
                className="skip-btn"
                aria-label="Skip back 5 seconds"
                tabIndex={0}
              >
                ⏪
              </button>
              <button
                onClick={() => skipTime(5)}
                className="skip-btn"
                aria-label="Skip forward 5 seconds"
                tabIndex={0}
              >
                ⏩
              </button>
            </div>
            <div
              className="progress-bar"
              onClick={handleProgressClick}
              role="progressbar"
              aria-valuenow={Math.round((currentTime / duration) * 100) || 0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Audio progress: ${Math.round((currentTime / duration) * 100) || 0}%`}
              tabIndex={0}
            >
              <div
                className="progress-fill"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              ></div>
            </div>
          </div>
          <div className="question-text" id="current-question" tabIndex={0}>
            {currentQ.question}
          </div>
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
        <nav className="game-buttons" aria-label="Game navigation">
          <button
            onClick={onBack}
            onKeyDown={(e) => handleKeyDown(e, onBack)}
            className="back-button"
            aria-label="Go back to level selection"
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
        </nav>
      </main>
    </div>
  );
};

export default ListeningGame;
import React, { useState, useRef, useCallback } from 'react';
import './Grammar.css';

interface GrammarProps {
  onNavigateBack: () => void;
  onNavigateToLevels: (videoData: { questions: any[], title: string }) => void;
}

const Grammar = ({ onNavigateBack, onNavigateToLevels }: GrammarProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const timeoutRef = useRef(null);
  const lastMouseMoveRef = useRef(0);

  // Datos de los 3 videos de gramática
  const grammarVideos = [
    {
      id: 1,
      title: "Future Perfect in Affirmative, Negative and Interrogative Form",
      description: "Learn the structure and usage of future perfect tense in all its forms. This video covers when and how to use future perfect correctly in English.",
      youtubeId: "8UUsGGwrNCY",
      embedUrl: "https://www.youtube.com/embed/8UUsGGwrNCY?si=_jFQPRF5Zusac8-T",
      tags: ["#FuturePerfect", "#Grammar", "#B2Level", "#Tenses"],
      questions: [
        {
          question: "Which sentence correctly uses the future perfect tense?",
          options: [
            "By 2025, I will have graduated from university.",
            "By 2025, I will graduate from university.",
            "By 2025, I have graduated from university.",
            "By 2025, I am graduating from university."
          ],
          correctAnswer: "By 2025, I will have graduated from university."
        },
        {
          question: "What is the negative form of 'She will have finished her work'?",
          options: [
            "She will not have finished her work.",
            "She will have not finished her work.",
            "She won't finished her work.",
            "She will not finish her work."
          ],
          correctAnswer: "She will not have finished her work."
        },
        {
          question: "How do you form a question in future perfect?",
          options: [
            "Will + subject + have + past participle",
            "Have + subject + will + past participle",
            "Subject + will + have + past participle",
            "Will + have + subject + past participle"
          ],
          correctAnswer: "Will + subject + have + past participle"
        },
        {
          question: "Complete: 'By the time you arrive, we ___ dinner.'",
          options: [
            "will have finished",
            "will finish",
            "have finished",
            "are finishing"
          ],
          correctAnswer: "will have finished"
        },
        {
          question: "Which time expression is commonly used with future perfect?",
          options: [
            "By the time",
            "Right now",
            "Yesterday",
            "At the moment"
          ],
          correctAnswer: "By the time"
        }
      ]
    },
    {
      id: 2,
      title: "Advanced Modal Verbs and Perfect Infinitives",
      description: "Master the use of modal verbs with perfect infinitives. Learn how to express past possibilities, regrets, and deductions in advanced English grammar.",
      youtubeId: "8UUsGGwrNCY",
      embedUrl: "https://www.youtube.com/embed/8UUsGGwrNCY?si=_jFQPRF5Zusac8-T",
      tags: ["#ModalVerbs", "#PerfectInfinitives", "#B2Level", "#AdvancedGrammar"],
      questions: [
        {
          question: "What does 'must have been' express?",
          options: [
            "Strong deduction about the past",
            "Obligation in the present",
            "Future possibility",
            "Present ability"
          ],
          correctAnswer: "Strong deduction about the past"
        },
        {
          question: "Complete: 'You look tired. You ___ working late.'",
          options: [
            "must have been",
            "must be",
            "should be",
            "could be"
          ],
          correctAnswer: "must have been"
        },
        {
          question: "Which expresses regret about the past?",
          options: [
            "I should have studied harder.",
            "I should study harder.",
            "I must study harder.",
            "I will study harder."
          ],
          correctAnswer: "I should have studied harder."
        },
        {
          question: "'Could have done' expresses:",
          options: [
            "Past possibility or missed opportunity",
            "Present ability",
            "Future possibility",
            "Obligation"
          ],
          correctAnswer: "Past possibility or missed opportunity"
        },
        {
          question: "What's the difference between 'might have' and 'must have'?",
          options: [
            "'Might have' shows uncertainty, 'must have' shows strong certainty",
            "'Might have' shows certainty, 'must have' shows uncertainty",
            "They mean exactly the same thing",
            "Both express future possibilities"
          ],
          correctAnswer: "'Might have' shows uncertainty, 'must have' shows strong certainty"
        }
      ]
    },
    {
      id: 3,
      title: "Conditional Sentences and Mixed Conditionals",
      description: "Explore complex conditional structures including mixed conditionals. Learn to express hypothetical situations across different time frames with confidence.",
      youtubeId: "GvTzCma_4JU",
      embedUrl: "https://www.youtube.com/embed/GvTzCma_4JU?si=xFgNtlfDjh6VrsNC",
      tags: ["#Conditionals", "#MixedConditionals", "#B2Level", "#HypotheticalSituations"],
      questions: [
        {
          question: "Which is an example of a mixed conditional?",
          options: [
            "If I had studied medicine, I would be a doctor now.",
            "If I study medicine, I will be a doctor.",
            "If I studied medicine, I would be a doctor.",
            "If I have studied medicine, I am a doctor."
          ],
          correctAnswer: "If I had studied medicine, I would be a doctor now."
        },
        {
          question: "Mixed conditionals combine which time frames?",
          options: [
            "Past condition with present result",
            "Present condition with present result",
            "Future condition with past result",
            "Past condition with past result"
          ],
          correctAnswer: "Past condition with present result"
        },
        {
          question: "Complete: 'If she ___ more confident, she would have applied for the job.'",
          options: [
            "were",
            "was",
            "had been",
            "is"
          ],
          correctAnswer: "were"
        },
        {
          question: "What does this express: 'If I were you, I would have done it differently'?",
          options: [
            "Present hypothetical condition with past hypothetical result",
            "Past condition with present result",
            "Future possibility",
            "Real present situation"
          ],
          correctAnswer: "Present hypothetical condition with past hypothetical result"
        },
        {
          question: "Which conditional type expresses impossible past situations?",
          options: [
            "Third conditional",
            "First conditional",
            "Second conditional",
            "Zero conditional"
          ],
          correctAnswer: "Third conditional"
        }
      ]
    }
  ];

  // Función para ocultar controles después de 3 segundos
  const hideControlsAfterDelay = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Función mejorada para mostrar controles con throttling
  const showControlsTemporarily = () => {
    const now = Date.now();
    if (now - lastMouseMoveRef.current < 500) {
      return;
    }
    lastMouseMoveRef.current = now;
    setShowControls(true);
    hideControlsAfterDelay();
  };

  const handleKeyDown = (e: any, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const handleNext = () => {
    onNavigateToLevels({
      questions: currentVideo.questions,
      title: currentVideo.title
    });
  };

  const currentVideo = grammarVideos[currentSlide];

  return (
    <div className="grammar-container">
      <header className="grammar-header" role="banner">
        <div className="header-logo">
          <img 
            src={process.env.PUBLIC_URL + "/logo_app.svg"} 
            alt="English Club - Grammar lesson application" 
            className="header-logo-img"
            role="img"
            tabIndex={0}
          />
        </div>
        <h1 className="grammar-main-title">GRAMMAR</h1>
        <div className="user-profile">
          <div className="profile-avatar" role="img" aria-label="User profile" tabIndex={0}>
            <span className="profile-icon" aria-hidden="true">👤</span>
          </div>
        </div>
      </header>

      <main className="grammar-content" role="main">
        <article className="grammar-card">
          <h2 className="lesson-title">{currentVideo.title}</h2>
          
          <section className="video-description">
            <p className="description-text">{currentVideo.description}</p>
            
            <div className="tags-section">
              <h3>Grammar Topics:</h3>
              <div className="tags-container" role="list" aria-label="Grammar topics">
                {currentVideo.tags.map((tag, index) => (
                  <span key={index} className="tag" role="listitem">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
          
          <section className="video-container" aria-labelledby="video-heading">
            <h3 id="video-heading" className="sr-only">Grammar lesson video</h3>
            
            <div 
              className="video-frame"
              onMouseMove={showControlsTemporarily}
              role="region"
              aria-label="Video player"
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
              <h4 className="sr-only">Video controls instructions</h4>
              <p className="sr-only">
                Use YouTube player controls to play, pause, adjust volume, and enable captions.
                Use Tab to navigate between controls.
              </p>
            </div>
          </section>

          <nav className="slide-indicators" role="tablist" aria-label="Video selection">
            {grammarVideos.map((_, index) => (
              <button
                key={index}
                className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                onKeyDown={(e) => handleKeyDown(e, () => setCurrentSlide(index))}
                role="tab"
                aria-selected={index === currentSlide}
                aria-label={`Video ${index + 1}`}
                tabIndex={0}
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
              Back
            </button>
            <button 
              onClick={handleNext} 
              onKeyDown={(e) => handleKeyDown(e, handleNext)}
              className="nav-button next-btn"
              aria-label="Start grammar exercises"
              tabIndex={0}
            >
              Start Exercises
            </button>
          </nav>
        </article>
      </main>
    </div>
  );
};

export default Grammar;

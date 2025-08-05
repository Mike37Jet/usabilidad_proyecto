import React, { useState } from 'react';
import './App.css';
import { PointsProvider } from './contexts/PointsContext.tsx';
import Login from './components/Login.tsx';
import Dashboard from './components/Dashboard.tsx';
import Reading from './components/Reading.tsx';
import Listening from './components/Listening.tsx';
import Grammar from './components/Grammar.tsx';
import GrammarGame from './components/GrammarGame.tsx';
import ListeningLevels from './components/ListeningLevels.tsx';
import ListeningGame from './components/ListeningGame.tsx';

function App() {
  const [currentState, setCurrentState] = useState('login');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [videoData, setVideoData] = useState({
    questions: [],
    title: ''
  });

  const handleLoginSuccess = () => {
    console.log('Login successful');
    setCurrentState('dashboard');
  };

  const handleLogout = () => {
    console.log('Logout');
    setCurrentState('login');
  };

  const handleNavigateToReading = () => {
    console.log('Navigating to Reading');
    setCurrentState('reading');
  };

  const handleNavigateToListening = () => {
    console.log('Navigating to Listening');
    setCurrentState('listening');
  };

  const handleNavigateToGrammar = () => {
    console.log('Navigating to Grammar');
    setCurrentState('grammar');
  };

  const handleNavigateToListeningLevels = () => {
    console.log('Navigating to Listening Levels');
    setCurrentState('listeningLevels');
  };

  const handleBackToDashboard = () => {
    console.log('Back to Dashboard');
    setCurrentState('dashboard');
  };

  const handleBackToListening = () => {
    console.log('Back to Listening');
    setCurrentState('listening');
  };

  const handleBackToListeningLevels = () => {
    console.log('Back to Listening Levels');
    setCurrentState('listeningLevels');
  };

  const handleLevelSelect = (level: number) => {
    console.log(`Level ${level} selected`);
    setSelectedLevel(level);
    setCurrentState('listeningGame');
  };

  const handleGameComplete = (score: number) => {
    console.log(`Game completed with score: ${score}`);
    alert(`Congratulations! You earned ${score} points!`);
    setCurrentState('listeningLevels');
  };

  const handleNavigateToGrammarGame = (videoData: { questions: any[], title: string }) => {
    console.log('Navigating to Grammar Game', videoData);
    setVideoData(videoData);
    setCurrentState('grammarGame');
  };

  const handleGrammarGameComplete = (score: number) => {
    console.log(`Grammar game completed with score: ${score}`);
    alert(`Congratulations! You earned ${score} points!`);
    setCurrentState('dashboard');
  };

  const handleBackToGrammar = () => {
    console.log('Back to Grammar');
    setCurrentState('grammar');
  };

  return (
    <PointsProvider>
      <div className="App">
        {currentState === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
        {currentState === 'dashboard' && (
          <Dashboard 
            onLogout={handleLogout} 
            onNavigateToReading={handleNavigateToReading}
            onNavigateToListening={handleNavigateToListening}
            onNavigateToGrammar={handleNavigateToGrammar}
          />
        )}
        {currentState === 'reading' && (
          <Reading onBack={handleBackToDashboard} />
        )}
        {currentState === 'listening' && (
          <Listening 
            onNavigateBack={handleBackToDashboard}
            onNavigateToLevels={handleNavigateToListeningLevels}
          />
        )}
        {currentState === 'grammar' && (
          <Grammar 
            onNavigateBack={handleBackToDashboard}
            onNavigateToLevels={handleNavigateToGrammarGame}
          />
        )}
        {currentState === 'listeningLevels' && (
          <ListeningLevels 
            onNavigateBack={handleBackToListening}
            onLevelSelect={handleLevelSelect}
          />
        )}
        {currentState === 'listeningGame' && (
          <ListeningGame 
            level={selectedLevel}
            onBack={handleBackToListeningLevels}
            onComplete={handleGameComplete}
          />
        )}
        {currentState === 'grammarGame' && (
          <GrammarGame 
            level={selectedLevel}
            videoQuestions={videoData.questions}
            videoTitle={videoData.title}
            onBack={handleBackToGrammar}
            onComplete={handleGrammarGameComplete}
          />
        )}
      </div>
    </PointsProvider>
  );
}

export default App;
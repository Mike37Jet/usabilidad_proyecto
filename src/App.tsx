import React, { useState } from 'react';
import './App.css';
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
  const [userScore, setUserScore] = useState(500); // Score del usuario
  const [userLives, setUserLives] = useState(3); // Vidas del usuario

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
    // Actualizar el score del usuario
    setUserScore(prevScore => prevScore + (score * 10)); // 10 puntos por respuesta correcta
    // Aquí puedes agregar lógica para guardar el progreso
    alert(`Congratulations! You scored ${score}/6`);
    setCurrentState('listeningLevels');
  };

  const handleNavigateToGrammarGame = () => {
    console.log('Navigating to Grammar Game');
    setCurrentState('grammarGame');
  };

  const handleGrammarGameComplete = (score: number) => {
    console.log(`Grammar game completed with score: ${score}`);
    setUserScore(prevScore => prevScore + (score * 10));
    alert(`Congratulations! You scored ${score}/${3}`);
    setCurrentState('dashboard');
  };

  const handleBackToGrammar = () => {
    console.log('Back to Grammar');
    setCurrentState('grammar');
  };

  return (
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
          score={userScore}
          lives={userLives}
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
          onBack={handleBackToGrammar}
          onComplete={handleGrammarGameComplete}
        />
      )}
    </div>
  );
}

export default App;
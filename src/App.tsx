import React, { useState } from 'react';
import './App.css';
import Login from './components/Login.tsx';
import Dashboard from './components/Dashboard.tsx';
import Reading from './components/Reading.tsx';

function App() {
  const [currentState, setCurrentState] = useState('login');

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

  const handleBackToDashboard = () => {
    console.log('Back to Dashboard');
    setCurrentState('dashboard');
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
        />
      )}
      {currentState === 'reading' && (
        <Reading onBack={handleBackToDashboard} />
      )}
    </div>
  );
}

export default App;
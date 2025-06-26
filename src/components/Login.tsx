import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    
    // Simulación de login exitoso
    if (email && password) {
      onLoginSuccess();
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
    onLoginSuccess();
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login');
    onLoginSuccess();
  };

  const handleForgotPassword = () => {
    console.log('Forgot password');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-container">
            <img 
              src="/logo_app.svg" 
              alt="English Club Logo" 
              className="app-logo"
            />
          </div>
        </div>
        
        <h1 className="welcome-title">Welcome</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">EMAIL</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@epn.edu.ec"
              className="input-field"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password" className="input-label">PASSWORD</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-field"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label="Toggle password visibility"
              >
                👁
              </button>
            </div>
          </div>
          
          <button type="submit" className="login-button">
            LOG IN
          </button>
        </form>
        
        <div className="social-login">
          <button onClick={handleGoogleLogin} className="social-button google-button">
            <span className="google-icon">G</span>
            Continuar con Google
          </button>
          
          <button onClick={handleFacebookLogin} className="social-button facebook-button">
            <span className="facebook-icon">f</span>
            Continuar con Facebook
          </button>
        </div>
        
        <div className="forgot-password">
          <span>¿Olvidaste la contraseña? </span>
          <button onClick={handleForgotPassword} className="forgot-link">
            Recuperar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is not valid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    console.log('Login attempt:', { email, password });
    
    try {
      // Successful login simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLoginSuccess();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
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

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="logo-section">
          <div className="logo-container">
            <img 
              src={process.env.PUBLIC_URL + "/logo_app.svg"} 
              alt="English Club logo - English learning application" 
              className="app-logo"
              role="img"
            />
          </div>
        </header>
        
        <h1 className="welcome-title">Welcome</h1>
        
        <main>
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors(prev => ({...prev, email: undefined}));
                  }
                }}
                placeholder="user@epn.edu.ec"
                className={`input-field ${errors.email ? 'error' : ''}`}
                required
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
                autoComplete="email"
              />
              {errors.email && (
                <div id="email-error" className="error-message" role="alert" aria-live="polite">
                  {errors.email}
                </div>
              )}
            </div>
            
            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password *
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => ({...prev, password: undefined}));
                    }
                  }}
                  placeholder="••••••••••••"
                  className={`input-field ${errors.password ? 'error' : ''}`}
                  required
                  aria-describedby={`password-help ${errors.password ? 'password-error' : ''}`.trim()}
                  aria-invalid={!!errors.password}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  onKeyDown={(e) => handleKeyDown(e, () => setShowPassword(!showPassword))}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  tabIndex={0}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              <div id="password-help" className="help-text">
                Password must be at least 6 characters
              </div>
              {errors.password && (
                <div id="password-error" className="error-message" role="alert" aria-live="polite">
                  {errors.password}
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
              aria-describedby="login-status"
            >
              {isLoading ? 'Logging in...' : 'LOG IN'}
            </button>
            
            {isLoading && (
              <div id="login-status" className="sr-only" aria-live="polite">
                Processing login, please wait
              </div>
            )}
          </form>
          
          <div className="social-login" role="group" aria-labelledby="social-login-heading">
            <h2 id="social-login-heading" className="sr-only">Social login options</h2>
            
            <button 
              onClick={handleGoogleLogin}
              onKeyDown={(e) => handleKeyDown(e, handleGoogleLogin)}
              className="social-button google-button"
              aria-label="Continue with Google"
            >
              <span className="google-icon" aria-hidden="true">G</span>
              Continue with Google
            </button>
            
            <button 
              onClick={handleFacebookLogin}
              onKeyDown={(e) => handleKeyDown(e, handleFacebookLogin)}
              className="social-button facebook-button"
              aria-label="Continue with Facebook"
            >
              <span className="facebook-icon" aria-hidden="true">f</span>
              Continue with Facebook
            </button>
          </div>
          
          <div className="forgot-password">
            <span>Forgot your password? </span>
            <button 
              onClick={handleForgotPassword}
              onKeyDown={(e) => handleKeyDown(e, handleForgotPassword)}
              className="forgot-link"
              aria-label="Recover forgotten password"
            >
              Reset Password
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
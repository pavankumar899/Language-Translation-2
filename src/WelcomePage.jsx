import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGetStarted = () => {  
    navigate('/login'); 
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="welcome-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="app-name">LinguaSync</span>
        </div>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <button className="nav-link" onClick={() => handleNavigation('/')}>Home</button>
          <button className="nav-link" onClick={() => handleNavigation('/about')}>About</button>
          <button className="nav-link" onClick={() => handleNavigation('/login')}>Log In</button>
          <button className="nav-link signup-btn" onClick={() => handleNavigation('/signup')}>Sign Up</button>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </nav>

      <div className="welcome-content">
        <div className="hello-section">
          <h1 className="hello-text">Hello!</h1>
          <div className="lottie-robot-container">
            <DotLottieReact
              src="https://lottie.host/b5a55d1d-28ba-42ee-938b-ce8f9a874853/LM559cSrft.lottie"
              loop
              autoplay
              className="lottie-robot"
            />
          </div>
        </div>
        
        <h1 className="main-title">Welcome to our<br />Language Translation App</h1>
        <p>Translate text instantly with smart AI assistance. Click below to begin!</p>
        <button 
          className="get-started-btn" 
          onClick={handleGetStarted}
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;






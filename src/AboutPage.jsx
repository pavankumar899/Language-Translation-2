import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css'; 
import { 
  Globe, 
  BookOpen, 
  Cpu, 
  Smartphone, 
  Code, 
  Users, 
  Zap, 
  FileText, 
  Mic, 
  Languages 
} from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="about-container">
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

      <div className="about-content">
        <section className="about-header">
          <div className="about-header-text">
            <h1>About LinguaSync</h1>
            <p>Bridging Language Barriers with AI-Powered Translation</p>
          </div>
          <div className="about-header-icon">
            <Globe size={80} strokeWidth={1.5} color="#8a4fff" />
          </div>
        </section>

        <section className="about-project">
          <div className="section-title">
            <BookOpen size={40} strokeWidth={1.5} />
            <h2>Project Overview</h2>
          </div>
          <p>
            LinguaSync is a cutting-edge Language Translation App designed to seamlessly translate English to Telugu, 
            leveraging advanced artificial intelligence to enhance communication and accessibility.
          </p>
        </section>

        <section className="key-features">
          <div className="section-title">
            <Zap size={40} strokeWidth={1.5} />
            <h2>Key Features</h2>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <Code size={32} />
              <h3>Instant Translation</h3>
              <p>Real-time English to Telugu translation</p>
            </div>
            <div className="feature-item">
              <FileText size={32} />
              <h3>PDF Support</h3>
              <p>Batch translation for documents</p>
            </div>
            <div className="feature-item">
              <Smartphone size={32} />
              <h3>Responsive Design</h3>
              <p>Optimal experience across all devices</p>
            </div>
            <div className="feature-item">
              <Cpu size={32} />
              <h3>AI-Powered</h3>
              <p>Advanced NLP techniques</p>
            </div>
          </div>
        </section>

        <section className="tech-stack">
          <div className="section-title">
            <Code size={40} strokeWidth={1.5} />
            <h2>Technology Stack</h2>
          </div>
          <div className="tech-grid">
            <div className="tech-item">
              <img  alt="React" />
              <h3>React.js</h3>
              <p>Frontend Framework</p>
            </div>
            <div className="tech-item">
              <img  alt="FastAPI" />
              <h3>FastAPI</h3>
              <p>Backend Framework</p>
            </div>
            <div className="tech-item">
              <img  alt="FireBase" />
              <h3>FireBase</h3>
              <p>Database Solution</p>
            </div>
            <div className="tech-item">
              <img  alt="AI Model" />
              <h3>MBart</h3>
              <p>Translation Model</p>
            </div>
          </div>
        </section>

        <section className="future-roadmap">
          <div className="section-title">
            <Zap size={40} strokeWidth={1.5} />
            <h2>Future Enhancements</h2>
          </div>
          <ul className="roadmap-list">
            <li>
              <Languages size={24} />
              Telugu to English Translation
            </li>
            <li>
              <Mic size={24} />
              Voice Input and Speech Output
            </li>
            <li>
              <Globe size={24} />
              Multi-Language Support
            </li>
            <li>
              <Users size={24} />
              Personalized Translation Suggestions
            </li>
          </ul>
        </section>

        <section className="team-section">
          <div className="section-title">
            <Users size={40} strokeWidth={1.5} />
            <h2>Meet the Team</h2>
          </div>
          <div className="team-grid">
            <div className="team-member">
              <p>Raghvula Bhargava</p>
              <h3>Frontend Developer</h3>
              <p>UI/UX Design & React Integration</p>
            </div>
            <div className="team-member">
              <p>Chinmayee</p>
              <p>Neeraja Reddy</p>
              <h3>AI Specialist</h3>
              <p>Model Integration & NLP</p>
            </div>
            <div className="team-member">
              <p>Punna  Sai Avanish</p>
              <p>Pavan Kumar</p>
              <h3>Backend Developer</h3>
              <p>API & System Architecture</p>
            </div>
            <div className="team-member">
              <p>Raghvula Bhargava</p>
              <p>Punna Sai Avanish</p>
              <h3>Deployment Engineer</h3>
              <p>Live Integration</p>
            </div>
          </div>
        </section>

        <footer className="about-footer">
          <p>
            LinguaSync: Connecting Cultures, One Translation at a Time
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;

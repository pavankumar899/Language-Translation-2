import React, { useState, useEffect } from 'react';
import './TranslatePage.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Spline from '@splinetool/react-spline';
import { saveTranslation } from './saveTranslation';
import { getUserHistory } from './getUserHistory';
import { getAuth } from 'firebase/auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
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

      <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

function TranslatePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Add this effect to track window width for responsive design
  const handleTranslate = async () => {
  setIsTranslating(true);
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;

    const response = await fetch('https://Bhargava093-Bhargava.hf.space/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        text: input,
        use_pretrained: true,
      }),
    });

    const data = await response.json();

    if (response.ok && data?.translated_text) {
      setOutput(data.translated_text);
      await saveTranslation(input, data.translated_text);
      setHistory(prev => [
        { sourceText: input, translatedText: data.translated_text },
        ...prev,
      ]);
    } else {
      setOutput('Error: Could not translate.');
    }
  } catch (error) {
    console.error('Error:', error);
    setOutput('Error: Could not connect to the server.');
  } finally {
    setIsTranslating(false);
  }
};
  useEffect(() => {
    const fetchHistory = async () => {
      if (showHistory) {
        setIsLoadingHistory(true);
        const userHistory = await getUserHistory();
        setHistory(userHistory);
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [showHistory]);

  // Determine if we should show the spline based on screen size
  const showSpline = windowWidth > 768;

  return (
    <div className="translate-container">
      <Navbar />

      <div className="heading-with-globe">
        <div className='globe-lottie'>
          <DotLottieReact
            src="https://lottie.host/30b14efa-e2ca-4281-821b-21ce56f1224d/JWjSqO9Foo.lottie"
            loop
            autoplay
          />
        </div>
        <h1>Translator</h1>
      </div>

      <div className='mm_cont'>
        {showSpline && (
          <div className="left-center-spline">
            <Spline scene="https://prod.spline.design/HMApVhVaFRu2OqCI/scene.splinecode" />
          </div>
        )}
        <div className="translator-grid">
          <div className="translator-box">
            <select><option>English</option></select>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Enter text to translate...'
            />
          </div>
          <div className="translator-box">
            <select><option>Telugu</option></select>
            <textarea
              value={output}
              readOnly
              placeholder='Translation will appear here...'
            />
          </div>
        </div>
      </div>

      <div className="btn-row">
        <button className="translate-btn" onClick={handleTranslate} disabled={isTranslating}>
          {isTranslating ? (
            <div style={{ width: '100px', height: '100px', transform: 'scale(1.3)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <DotLottieReact
                src="https://lottie.host/c290f5b0-3fb7-4237-bcb0-3106e38f04f4/rXZkGtllHD.lottie"
                loop
                autoplay
              />
            </div>
          ) : (
            'Translate'
          )}
        </button>

        <button className="history-btn" onClick={() => setShowHistory(prev => !prev)}>
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      <h6 className="disclaimer">This model can make mistakes. Check important info.</h6>

      {showHistory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowHistory(false)}>×</button>
            <h3>Translation History</h3>

            {isLoadingHistory ? (
              <p>Loading...</p>
            ) : history.length === 0 ? (
              <p>No translations yet.</p>
            ) : (
              <ul className="history-list">
                {history.map((item, index) => (
                  <li key={index}>
                    <strong>Input:</strong> {item.sourceText}<br />
                    <strong>Output:</strong> {item.translatedText}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TranslatePage;


// import React, { useState, useEffect } from 'react';
// import './TranslatePage.css';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import Spline from '@splinetool/react-spline';
// import { saveTranslation } from './saveTranslation';
// import { getUserHistory } from './getUserHistory';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(prev => !prev);
//   };

//   const handleNavigation = (path) => {
//     window.location.href = path;
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-brand">
//         <span className="app-name">LinguaSync</span>
//       </div>
      
//       <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
//         <button className="nav-link" onClick={() => handleNavigation('/')}>Home</button>
//         <button className="nav-link" onClick={() => handleNavigation('/about')}>About</button>
//         <button className="nav-link" onClick={() => handleNavigation('/login')}>Log In</button>
//         <button className="nav-link signup-btn" onClick={() => handleNavigation('/signup')}>Sign Up</button>
//       </div>

//       <div className="hamburger" onClick={toggleMenu}>
//         <span className="bar"></span>
//         <span className="bar"></span>
//         <span className="bar"></span>
//       </div>
//     </nav>
//   );
// };

// function TranslatePage() {
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState('');
//   const [history, setHistory] = useState([]);
//   const [showHistory, setShowHistory] = useState(false);
//   const [isTranslating, setIsTranslating] = useState(false);
//   const [isLoadingHistory, setIsLoadingHistory] = useState(false);

//   const handleTranslate = async () => {
//     setIsTranslating(true);
//     try {
//       const response = await fetch('https://Bhargava093-Bhargava.hf.space/translate/', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     text: input,
//     use_pretrained: true,
//   }),
// });


//       const data = await response.json();
//       if (response.ok) {
//         setOutput(data.translated_text);

//         await saveTranslation(input, data.translated_text);

//         setHistory(prev => [
//           { sourceText: input, translatedText: data.translated_text },
//           ...prev,
//         ]);
//       } else {
//         setOutput('Error: Could not translate.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setOutput('Error: Could not connect to the server.');
//     } finally {
//       setIsTranslating(false);
//     }
//   };

//   useEffect(() => {
//     const fetchHistory = async () => {
//       if (showHistory) {
//         setIsLoadingHistory(true);
//         const userHistory = await getUserHistory();
//         setHistory(userHistory);
//         setIsLoadingHistory(false);
//       }
//     };

//     fetchHistory();
//   }, [showHistory]);

//   return (
//     <div className="translate-container">
//       <Navbar />

//       <div className="heading-with-globe">
//         <div className='globe-lottie'>
//           <DotLottieReact
//             src="https://lottie.host/30b14efa-e2ca-4281-821b-21ce56f1224d/JWjSqO9Foo.lottie"
//             loop
//             autoplay
//           />
//         </div>
//         <h1>Translator</h1>
//       </div>

//       <div className='mm_cont'>
//         <div className="translator-grid">
//           <div className="left-center-spline">
//             <Spline scene="https://prod.spline.design/HMApVhVaFRu2OqCI/scene.splinecode" />
//           </div>
//           <div className="translator-box">
//             <select><option>English</option></select>
//             <textarea
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder='Enter text to translate...'
//             />
//           </div>
//           <div className="translator-box">
//             <select><option>Telugu</option></select>
//             <textarea
//               value={output}
//               readOnly
//               placeholder='Translation will appear here...'
//             />
//           </div>
//         </div>
//       </div>

//       <div className="btn-row">
//         <button className="translate-btn" onClick={handleTranslate} disabled={isTranslating}>
//           {isTranslating ? (
//             <div style={{ width: '100px', height: '100px', transform: 'scale(1.3)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//               <DotLottieReact
//                 src="https://lottie.host/c290f5b0-3fb7-4237-bcb0-3106e38f04f4/rXZkGtllHD.lottie"
//                 loop
//                 autoplay
//               />
//             </div>
//           ) : (
//             'Translate'
//           )}
//         </button>

//         <button className="history-btn" onClick={() => setShowHistory(prev => !prev)}>
//           {showHistory ? "Hide History" : "Show History"}
//         </button>
//       </div>

//       <h6 className="disclaimer">This model can make mistakes. Check important info.</h6>

//       {showHistory && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button className="close-btn" onClick={() => setShowHistory(false)}>×</button>
//             <h3>Translation History</h3>

//             {isLoadingHistory ? (
//               <p>Loading...</p>
//             ) : history.length === 0 ? (
//               <p>No translations yet.</p>
//             ) : (
//               <ul className="history-list">
//                 {history.map((item, index) => (
//                   <li key={index}>
//                     <strong>Input:</strong> {item.sourceText}<br />
//                     <strong>Output:</strong> {item.translatedText}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TranslatePage;


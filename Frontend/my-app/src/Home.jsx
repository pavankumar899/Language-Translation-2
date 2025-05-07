import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { IoLanguage, IoDocumentTextOutline } from 'react-icons/io5';
import { FaArrowRight } from 'react-icons/fa';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const englishWords = ["Hello", "Translate", "World", "Learning", "Speak", "Write"];
const teluguWords = ["హలో", "అనువదించు", "ప్రపంచం", "నేర్చుకో", "మాట్లాడు", "రాయు"];

function Home() {
  const [enIndex, setEnIndex] = useState(0);
  const [teIndex, setTeIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setEnIndex((prev) => (prev + 1) % englishWords.length);
      setTeIndex((prev) => (prev + 1) % teluguWords.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-body">
      {/* Left side thinker */}
      <div className="thinker">
        <img src="https://cdn-icons-png.flaticon.com/512/236/236831.png" alt="man" className="face" width="100" />
        <div className="thought">{englishWords[enIndex]}</div>
      </div>

      <div className='m_cont'>
        {/* ✅ Animation on top, Heading below it */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '140px', margin: '0 auto' }}>
            <DotLottieReact
              src="https://lottie.host/7ef63db1-174e-4dca-8f6f-baa22fdbc0e4/fmrbO8LNYu.lottie" 
              loop
              autoplay
            />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '10px' }}>Language Translator</h1>
        </div>

        {/* Main container box */}
        <div className="container">
          <h2>Let's translate </h2>
          <p className="subtitle">anything with ease</p>

          <div className="card ai" onClick={() => navigate('/translate')}>
            <div className="icon-box">
              <IoLanguage />
            </div>
            <div className="text">
              <h3>Translate Ai</h3>
              <p>Let's use Ai easily</p>
            </div>
            <div className="arrow">
              <FaArrowRight />
            </div>
          </div>

          <div className="card pdf" onClick={() => navigate('/uploadpage')}>
            <div className="icon-box">
              <IoDocumentTextOutline />
            </div>
            <div className="text">
              <h3>Upload File</h3>
              <p>Select and translate a file</p>
            </div>
            <div className="arrow">
              <FaArrowRight />
            </div>
          </div>
        </div>
      </div>

      {/* Right side thinker */}
      <div className="thinker">
        <img src="https://cdn-icons-png.flaticon.com/512/236/236832.png" alt="woman" className="face" width="100" />
        <div className="thought">{teluguWords[teIndex]}</div>
      </div>
    </div>
  );
}

export default Home;

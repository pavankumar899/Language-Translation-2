import React, { useState, useEffect } from 'react';
import './UploadPage.css';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function UploadPage() {
  const [fileName, setFileName] = useState('');
  const [uploadedText, setUploadedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('fileTranslationHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fileTranslationHistory', JSON.stringify(history));
  }, [history]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => setUploadedText(event.target.result);
    reader.readAsText(file);
  };

  const handleTranslate = async () => {
    if (!uploadedText.trim()) {
      alert('Please upload a file first.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/translate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: uploadedText,
          use_pretrained: true,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTranslatedText(data.translated_text);

        // Add to history
        setHistory((prev) => [
          ...prev,
          { fileName, originalText: uploadedText, translatedText: data.translated_text },
        ]);
      } else {
        setTranslatedText(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      setTranslatedText('Error: Could not translate.');
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('fileTranslationHistory');
    setHistory([]);
  };

  return (
    <motion.div className="upload-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <div className="doc-lottie">
        <DotLottieReact src="https://lottie.host/d20def1a-9c3c-4b78-ac1f-f25e9176a475/7Qgm5jjn6S.lottie" loop autoplay />
        <h1>Document</h1>
        <h1 className="name2">Translator</h1>
      </div>

      <motion.div className="upload-box" whileHover={{ scale: 1.03 }}>
        <input type="file" accept=".txt,.docx,.pdf" onChange={handleFileUpload} className="file-input" />
        {fileName && <p className="filename">Uploaded: {fileName}</p>}
      </motion.div>

      <div className="text-container">
        <div className="text-column">
          <h3>Original Text</h3>
          <textarea className="upload-textarea" value={uploadedText} readOnly placeholder="Uploaded file content..." />
        </div>
        <div className="text-column">
          <h3>Translated Text</h3>
          <textarea className="upload-textarea" value={translatedText} readOnly placeholder="Translated text..." />
        </div>
      </div>

      <div className="btn-row">
        <motion.button className="translate-btn" whileTap={{ scale: 0.95 }} onClick={handleTranslate}>
          Translate
        </motion.button>
        <motion.button className="history-btn" whileTap={{ scale: 0.95 }} onClick={() => setShowHistory(true)}>
          History
        </motion.button>
      </div>

      <p className="disclaimer">This model can make mistakes. Check important info.</p>

      {/* History Modal */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowHistory(false)}>✕</button>
            <h3>Translation History</h3>
            {history.length === 0 ? (
              <p>No translations yet.</p>
            ) : (
              <ul>
                {history.map((item, index) => (
                  <li key={index}>
                    <strong>File:</strong> {item.fileName}<br />
                    <strong>Original Text:</strong> {item.originalText}<br />
                    <strong>Translated Text:</strong> {item.translatedText}
                  </li>
                ))}
              </ul>
            )}
            {history.length > 0 && (
              <button className="clear-btn" onClick={handleClearHistory}>
                Clear History
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default UploadPage;

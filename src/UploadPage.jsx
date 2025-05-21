import React, { useState, useEffect } from 'react';
import './UploadPage.css';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { getAuth } from 'firebase/auth';
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';

function UploadPage() {
  const [fileName, setFileName] = useState('');
  const [uploadedText, setUploadedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const auth = getAuth();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user-specific history from Firestore
  const fetchUserHistory = async (user) => {
    try {
      const q = query(collection(db, 'translations'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const userHistory = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(userHistory);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserHistory(user);
      } else {
        setHistory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
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

    const user = auth.currentUser;
    if (!user) {
      alert('Please log in first.');
      return;
    }

    setIsTranslating(true);
    try {
      const idToken = await user.getIdToken();
      // const response = await fetch('http://localhost:5000/translate/', {
     // const response = await fetch('https://Bhargava093-Bhargava.hf.space/translate/' 
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/translate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          text: uploadedText,
          use_pretrained: true,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTranslatedText(data.translated_text);

        // Save history to Firestore
        await addDoc(collection(db, 'translations'), {
          userId: user.uid,
          sourceText: uploadedText,
          translatedText: data.translated_text,
          method: 'Pretrained', // optional
          createdAt: new Date(),
        });

        // Refresh user history
        fetchUserHistory(user);
      } else {
        setTranslatedText(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Translation error:', err);
      setTranslatedText('Error: Could not translate.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleClearHistory = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(collection(db, 'translations'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      for (const docSnap of querySnapshot.docs) {
        await deleteDoc(doc(db, 'translations', docSnap.id));
      }
      setHistory([]);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  return (
    <motion.div
      className="upload-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="doc-lottie">
        {/* Conditionally render the Lottie animation with appropriate size based on screen width */}
        <div style={{ 
          width: windowWidth < 480 ? '80px' : windowWidth < 768 ? '100px' : '120px', 
          height: windowWidth < 480 ? '80px' : windowWidth < 768 ? '100px' : '120px' 
        }}>
          <DotLottieReact
            src="https://lottie.host/d20def1a-9c3c-4b78-ac1f-f25e9176a475/7Qgm5jjn6S.lottie"
            loop
            autoplay
          />
        </div>
        <h1>Document</h1>
        <h1 className="name2">Translator</h1>
      </div>

      <motion.div className="upload-box" whileHover={{ scale: 1.03 }}>
        <input
          type="file"
          accept=".txt,.docx,.pdf"
          onChange={handleFileUpload}
          className="file-input"
        />
        {fileName && <p className="filename">Uploaded: {fileName}</p>}
      </motion.div>

      <div className="text-container">
        <div className="text-column">
          <h3>Original Text</h3>
          <textarea
            className="upload-textarea"
            value={uploadedText}
            readOnly
            placeholder="Uploaded file content..."
          />
        </div>
        <div className="text-column">
          <h3>Translated Text</h3>
          <textarea
            className="upload-textarea"
            value={translatedText}
            readOnly
            placeholder="Translated text..."
          />
        </div>
      </div>

      <div className="btn-row">
        <motion.button
          className="translate-btn"
          whileTap={{ scale: 0.95 }}
          onClick={handleTranslate}
          disabled={isTranslating}
        >
          {isTranslating ? (
            <div style={{ 
              width: windowWidth < 480 ? '60px' : '80px', 
              height: windowWidth < 480 ? '60px' : '80px', 
              transform: 'scale(1.3)' 
            }}>
              <DotLottieReact
                src="https://lottie.host/c290f5b0-3fb7-4237-bcb0-3106e38f04f4/rXZkGtllHD.lottie"
                loop
                autoplay
              />
            </div>
          ) : (
            'Translate'
          )}
        </motion.button>

        <motion.button
          className="history-btn"
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHistory(true)}
        >
          Show History
        </motion.button>
      </div>

      <p className="disclaimer">This model can make mistakes. Check important info.</p>

      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowHistory(false)}>
              ✕
            </button>
            <h3>Translation History</h3>
            {history.length === 0 ? (
              <p>No translations yet.</p>
            ) : (
              <ul>
                {history.map((item, index) => (
                  <li key={index}>
                    <strong>Original Text:</strong> {item.sourceText && item.sourceText.length > 50 
                      ? `${item.sourceText.substring(0, 50)}...` 
                      : item.sourceText}
                    <br />
                    <strong>Translated Text:</strong> {item.translatedText && item.translatedText.length > 50 
                      ? `${item.translatedText.substring(0, 50)}...` 
                      : item.translatedText}
                    <br />
                    <strong>Method:</strong> {item.method}
                    <br />
                    <strong>Date:</strong>{' '}
                    {item.createdAt?.toDate
                      ? item.createdAt.toDate().toLocaleString()
                      : new Date(item.createdAt).toLocaleString()}
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






// import React, { useState, useEffect } from 'react';
// import './UploadPage.css';
// import { motion } from 'framer-motion';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import { getAuth } from 'firebase/auth';
// import { db } from './firebase';
// import {
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
//   deleteDoc,
//   doc,
// } from 'firebase/firestore';

// function UploadPage() {
//   const [fileName, setFileName] = useState('');
//   const [uploadedText, setUploadedText] = useState('');
//   const [translatedText, setTranslatedText] = useState('');
//   const [history, setHistory] = useState([]);
//   const [showHistory, setShowHistory] = useState(false);
//   const [isTranslating, setIsTranslating] = useState(false);

//   const auth = getAuth();

//   // Fetch user-specific history from Firestore
//   const fetchUserHistory = async (user) => {
//     try {
//       const q = query(collection(db, 'translations'), where('userId', '==', user.uid));
//       const querySnapshot = await getDocs(q);
//       const userHistory = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setHistory(userHistory);
//     } catch (err) {
//       console.error('Error fetching history:', err);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         fetchUserHistory(user);
//       } else {
//         setHistory([]);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     setFileName(file.name);

//     const reader = new FileReader();
//     reader.onload = (event) => setUploadedText(event.target.result);
//     reader.readAsText(file);
//   };

//   const handleTranslate = async () => {
//     if (!uploadedText.trim()) {
//       alert('Please upload a file first.');
//       return;
//     }

//     const user = auth.currentUser;
//     if (!user) {
//       alert('Please log in first.');
//       return;
//     }

//     setIsTranslating(true);
//     try {
//       const idToken = await user.getIdToken();
//      const response = await fetch('https://Bhargava093-Bhargava.hf.space/translate/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${idToken}`,
//         },
//         body: JSON.stringify({
//           text: uploadedText,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setTranslatedText(data.translated_text);

//         // Save history to Firestore
//         await addDoc(collection(db, 'translations'), {
//           userId: user.uid,
//           sourceText: uploadedText,
//           translatedText: data.translated_text,
//           method: 'Pretrained', // optional
//           createdAt: new Date(),
//         });

//         // Refresh user history
//         fetchUserHistory(user);
//       } else {
//         setTranslatedText(`Error: ${data.error || 'Unknown error'}`);
//       }
//     } catch (err) {
//       console.error('Translation error:', err);
//       setTranslatedText('Error: Could not translate.');
//     } finally {
//       setIsTranslating(false);
//     }
//   };

//   const handleClearHistory = async () => {
//     const user = auth.currentUser;
//     if (!user) return;

//     try {
//       const q = query(collection(db, 'translations'), where('userId', '==', user.uid));
//       const querySnapshot = await getDocs(q);
//       for (const docSnap of querySnapshot.docs) {
//         await deleteDoc(doc(db, 'translations', docSnap.id));
//       }
//       setHistory([]);
//     } catch (err) {
//       console.error('Error clearing history:', err);
//     }
//   };

//   return (
//     <motion.div
//       className="upload-container"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.8 }}
//     >
//       <div className="doc-lottie">
//         <DotLottieReact
//           src="https://lottie.host/d20def1a-9c3c-4b78-ac1f-f25e9176a475/7Qgm5jjn6S.lottie"
//           loop
//           autoplay
//         />
//         <h1>Document</h1>
//         <h1 className="name2">Translator</h1>
//       </div>

//       <motion.div className="upload-box" whileHover={{ scale: 1.03 }}>
//         <input
//           type="file"
//           accept=".txt,.docx,.pdf"
//           onChange={handleFileUpload}
//           className="file-input"
//         />
//         {fileName && <p className="filename">Uploaded: {fileName}</p>}
//       </motion.div>

//       <div className="text-container">
//         <div className="text-column">
//           <h3>Original Text</h3>
//           <textarea
//             className="upload-textarea"
//             value={uploadedText}
//             readOnly
//             placeholder="Uploaded file content..."
//           />
//         </div>
//         <div className="text-column">
//           <h3>Translated Text</h3>
//           <textarea
//             className="upload-textarea"
//             value={translatedText}
//             readOnly
//             placeholder="Translated text..."
//           />
//         </div>
//       </div>

//       <div className="btn-row">
//         <motion.button
//           className="translate-btn"
//           whileTap={{ scale: 0.95 }}
//           onClick={handleTranslate}
//           disabled={isTranslating}
//         >
//           {isTranslating ? (
//             <div style={{ width: '100px', height: '100px', transform: 'scale(1.3)' }}>
//               <DotLottieReact
//                 src="https://lottie.host/c290f5b0-3fb7-4237-bcb0-3106e38f04f4/rXZkGtllHD.lottie"
//                 loop
//                 autoplay
//               />
//             </div>
//           ) : (
//             'Translate'
//           )}
//         </motion.button>

//         <motion.button
//           className="history-btn"
//           whileTap={{ scale: 0.95 }}
//           onClick={() => setShowHistory(true)}
//         >
//           Show History
//         </motion.button>
//       </div>

//       <p className="disclaimer">This model can make mistakes. Check important info.</p>

//       {showHistory && (
//         <div className="modal-overlay" onClick={() => setShowHistory(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <button className="close-btn" onClick={() => setShowHistory(false)}>
//               ✕
//             </button>
//             <h3>Translation History</h3>
//             {history.length === 0 ? (
//               <p>No translations yet.</p>
//             ) : (
//               <ul>
//                 {history.map((item, index) => (
//                   <li key={index}>
//                     <strong>Original Text:</strong> {item.sourceText}
//                     <br />
//                     <strong>Translated Text:</strong> {item.translatedText}
//                     <br />
//                     <strong>Method:</strong> {item.method}
//                     <br />
//                     <strong>Date:</strong>{' '}
//                     {item.createdAt?.toDate
//                       ? item.createdAt.toDate().toLocaleString()
//                       : new Date(item.createdAt).toLocaleString()}
//                   </li>
//                 ))}
//               </ul>
//             )}
//             {history.length > 0 && (
//               <button className="clear-btn" onClick={handleClearHistory}>
//                 Clear History
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// }

// export default UploadPage;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import TranslatePage from './TranslatePage';
import UploadPage from './UploadPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/translate" element={<TranslatePage />} />
      <Route path="/uploadpage" element={<UploadPage />} />
    </Routes>
  );
}

export default App;




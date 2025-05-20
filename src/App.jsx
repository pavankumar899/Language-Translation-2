// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Home from './Home';
// import TranslatePage from './TranslatePage';
// import UploadPage from './UploadPage';

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/translate" element={<TranslatePage />} />
//       <Route path="/uploadpage" element={<UploadPage />} />
//     </Routes>
//   );
// }

// export default App;




// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import WelcomePage from './WelcomePage'
// import Home from './Home';
// import TranslatePage from './TranslatePage';
// import UploadPage from './UploadPage';

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<WelcomePage />} />
//       <Route path="/home" element={<Home />} />
//       <Route path="/translate" element={<TranslatePage />} />
//       <Route path="/uploadpage" element={<UploadPage />} />
//     </Routes>
//   );
// }

// export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './WelcomePage'
import Home from './Home';
import TranslatePage from './TranslatePage';
import UploadPage from './UploadPage';
import AboutPage from './AboutPage';  // Add this import
import LoginPage from './LoginPage';
import SignUP from './SignUp'; // Add this import

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/translate" element={<TranslatePage />} />
      <Route path="/uploadpage" element={<UploadPage />} />
      <Route path="/about" element={<AboutPage />} />  {/* Add this route */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignUP/>} />
    </Routes>
  );
}

export default App;



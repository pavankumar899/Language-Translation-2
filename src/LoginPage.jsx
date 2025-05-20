// import React, { useState } from 'react';
// import './LoginPage.css';
// import { FcGoogle } from 'react-icons/fc';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     console.log('Login attempted with:', email);
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//          <DotLottieReact
//       src="https://lottie.host/6474cb83-eb68-4a0d-94c7-5639ead332b2/reLb40tHYq.lottie"
//       loop
//       autoplay
//     /> 
//         <h1 className="login-title">Welcome back!</h1>
//         <p className="login-subtitle">Please enter your details.</p>
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
          
//           <button type="submit" className="sign-in-button">
//             Log in
//           </button>
//         </form>
        
//         <div className="google-signin">
//           <button className="google-button">
//             <FcGoogle className="google-icon" />
//             Sign in with Google
//           </button>
//         </div>
        
//         <p className="signup-prompt">
//           Don't have an account? <a href="/signup">Sign up</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;









import React, { useState } from 'react';
import './LoginPage.css';
import { FcGoogle } from 'react-icons/fc';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/home'); // Redirect to home
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      alert('Signed in with Google!');
      navigate('/home'); // Redirect to home
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="main-container">
      <div className="animation-container">
        <DotLottieReact
          src="https://lottie.host/6474cb83-eb68-4a0d-94c7-5639ead332b2/reLb40tHYq.lottie"
          loop
          autoplay
          className="lottie-animation"
        />
      </div>
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Welcome back!</h1>
          <p className="login-subtitle">Please enter your details.</p>
          {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="sign-in-button">
              Log in
            </button>
          </form>
          <div className="google-signin">
            <button className="google-button" type="button" onClick={handleGoogleSignIn}>
              <FcGoogle className="google-icon" />
              Sign in with Google
            </button>
          </div>
          <p className="signup-prompt">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;



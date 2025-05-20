import React, { useState } from 'react';
import './SignUp.css';
import { FcGoogle } from 'react-icons/fc';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { auth, googleProvider } from './firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Sign up successful!');
      // Optionally redirect or clear form
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      alert('Signed up with Google!');
      // Optionally redirect
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="main-container">
      {/* ...existing code... */}
      <div className="animation-container">
        <DotLottieReact
          src="https://lottie.host/d48374c5-b1a3-4228-a72c-d5c2f9fe6005/kvm0j5a6CP.lottie"
          loop
          autoplay
          className="lottie-animation"
        />
      </div>
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Sign Up!</h1>
          <p className="login-subtitle">Just a few things to get started</p>
          {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email ID</label>
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
              <label htmlFor="password">New Password</label>
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
              Sign Up
            </button>
          </form>
          <div className="google-signin">
            <button className="google-button" type="button" onClick={handleGoogleSignUp}>
              <FcGoogle className="google-icon" />
              Sign Up with Google
            </button>
          </div>
          <p className="signup-prompt">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login-register.css'; // Make sure this path matches your file structure

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Retrieve credentials from localStorage
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    // Validate the input with the stored credentials
    if (email === storedEmail && password === storedPassword) {
      console.log('User Logged In:', { email });
      navigate('/'); // Redirect to home page on successful login
    } else {
      setErrorMessage('Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="auth-button"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

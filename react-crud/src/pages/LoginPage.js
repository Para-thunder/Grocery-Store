import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginToast from '../components/LoginToast'; // Add this import
import '../styles/login-register.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showLoginToast, setShowLoginToast] = useState(false); // Add this state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          name: data.name,
          email: data.email,
          customerId: data.customerId
        }));
        
        // Show the login toast
        setShowLoginToast(true);
        
        // Redirect after showing the toast
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setErrorMessage(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="auth-container">
      {/* Add the LoginToast component */}
      {showLoginToast && (
        <LoginToast 
          userEmail={email} 
          onClose={() => setShowLoginToast(false)} 
        />
      )}
      
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
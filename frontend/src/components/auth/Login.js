import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TranslatableText from '../TranslatableText';
import styles from './Login.module.css';

const Login = ({ onClose }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    role: 'User',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const navigateToRoleDashboard = (userRole) => {
    console.log('Login successful for role:', userRole);
    // For users, redirect to homepage instead of dashboard
    // They can access their dashboard via the "My Dashboard" button
    if (userRole === 'user') {
      navigate('/');
    } else {
      // Lawyers and admins go directly to their dashboards
      switch (userRole) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'lawyer':
          navigate('/lawyer-dashboard');
          break;
        default:
          navigate('/');
          break;
      }
    }
    onClose(); // Close modal after navigation
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isRegisterMode) {
      // Registration validation
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (!formData.acceptTerms) {
        setError('Please accept the terms and conditions');
        setLoading(false);
        return;
      }

      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      if (result.success) {
        navigateToRoleDashboard(formData.role);
      } else {
        setError(result.error);
      }
    } else {
      // Login validation
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const result = await login(formData.email, formData.password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, user role:', result.user.role);
        navigateToRoleDashboard(result.user.role);
      } else {
        setError(result.error);
      }
    }
    
    setLoading(false);
  };

  // Demo credentials for easy testing
  const demoCredentials = [
    { role: 'Admin', email: 'admin@legalaid.com', password: 'admin123' },
    { role: 'Lawyer', email: 'lawyer@legalaid.com', password: 'lawyer123' },
    { role: 'User', email: 'user@legalaid.com', password: 'user123' }
  ];

  const fillDemoCredentials = (email, password) => {
    setFormData({ 
      ...formData,
      email, 
      password 
    });
    setError('');
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
      role: 'User',
      acceptTerms: false
    });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginHeader}>
        <h2>
          <TranslatableText text={isRegisterMode ? "Join LegalAid India" : "Login to LegalAid India"} />
        </h2>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        {error && (
          <div className={styles.errorMessage}>
            <i className="fas fa-exclamation-circle"></i>
            <TranslatableText text={error} />
          </div>
        )}

        {isRegisterMode && (
          <div className={styles.formGroup}>
            <label htmlFor="name">
              <TranslatableText text="Full Name" />
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="email">
            <TranslatableText text="Email Address" />
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">
            <TranslatableText text="Password" />
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        {isRegisterMode && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">
                <TranslatableText text="Confirm Password" />
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role">
                <TranslatableText text="Role" />
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={styles.selectInput}
              >
                <option value="User">User</option>
                <option value="Lawyer">Lawyer</option>
              </select>
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
              />
              <label htmlFor="acceptTerms">
                <TranslatableText text="I agree to the " />
                <button type="button" className={styles.termsLink}>
                  <TranslatableText text="Terms and Conditions" />
                </button>
              </label>
            </div>
          </>
        )}

        <button
          type="submit"
          className={styles.loginButton}
          disabled={loading}
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <>
              <i className={isRegisterMode ? "fas fa-user-plus" : "fas fa-sign-in-alt"}></i>
              <TranslatableText text={isRegisterMode ? "Create Account" : "Login"} />
            </>
          )}
        </button>

        {!isRegisterMode && (
          <>
            <div className={styles.divider}>
              <span><TranslatableText text="or" /></span>
            </div>

            <div className={styles.demoSection}>
              <h3><TranslatableText text="Demo Accounts" /></h3>
              <p><TranslatableText text="Click to auto-fill credentials:" /></p>
              <div className={styles.demoButtons}>
                {demoCredentials.map((demo, index) => (
                  <button
                    key={index}
                    type="button"
                    className={styles.demoButton}
                    onClick={() => fillDemoCredentials(demo.email, demo.password)}
                  >
                    <i className={`fas fa-${demo.role === 'Admin' ? 'crown' : demo.role === 'Lawyer' ? 'gavel' : 'user'}`}></i>
                    <span>{demo.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className={styles.registerLink}>
          <TranslatableText text={isRegisterMode ? "Already have an account?" : "Don't have an account?"} />
          <button 
            type="button" 
            onClick={toggleMode}
            className={styles.linkButton}
          >
            <TranslatableText text={isRegisterMode ? "Login here" : "Register here"} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

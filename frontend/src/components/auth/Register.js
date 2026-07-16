import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TranslatableText from '../TranslatableText';
import styles from './Register.module.css';

const Register = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register } = useAuth();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all required fields';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (!formData.agreeToTerms) {
      return 'Please agree to the terms and conditions';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      setSuccess('Registration successful! You can now login with your credentials.');
      setTimeout(() => {
        onSwitchToLogin(); // Switch to login form after successful registration
      }, 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerHeader}>
        <h2><TranslatableText text="Create Your Account" /></h2>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.registerForm}>
        {error && (
          <div className={styles.errorMessage}>
            <i className="fas fa-exclamation-circle"></i>
            <TranslatableText text={error} />
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            <i className="fas fa-check-circle"></i>
            <TranslatableText text={success} />
          </div>
        )}

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              <TranslatableText text="Full Name" /> *
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
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="email">
              <TranslatableText text="Email Address" /> *
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
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="phone">
              <TranslatableText text="Phone Number" />
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="password">
              <TranslatableText text="Password" /> *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">
              <TranslatableText text="Confirm Password" /> *
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
        </div>

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            required
          />
          <label htmlFor="agreeToTerms">
            <TranslatableText text="I agree to the " />
            <a href="#" className={styles.termsLink}>
              <TranslatableText text="Terms and Conditions" />
            </a>
            <TranslatableText text=" and " />
            <a href="#" className={styles.termsLink}>
              <TranslatableText text="Privacy Policy" />
            </a>
          </label>
        </div>

        <button 
          type="submit" 
          className={styles.registerButton}
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <TranslatableText text="Creating Account..." />
            </>
          ) : (
            <TranslatableText text="Create Account" />
          )}
        </button>
      </form>

      <div className={styles.loginLink}>
        <TranslatableText text="Already have an account?" />
        <button 
          type="button" 
          onClick={onSwitchToLogin}
          className={styles.linkButton}
        >
          <TranslatableText text="Login here" />
        </button>
      </div>
    </div>
  );
};

export default Register;

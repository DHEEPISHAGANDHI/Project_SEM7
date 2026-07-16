import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TranslatableText from '../components/TranslatableText';
import styles from './FreeLegalConsultation.module.css';

const FreeLegalConsultation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    legalIssue: '',
    urgencyLevel: 'medium',
    preferredTime: '',
    description: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Consultation request submitted:', formData);
    setIsSubmitted(true);
    
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        legalIssue: '',
        urgencyLevel: 'medium',
        preferredTime: '',
        description: ''
      });
    }, 3000);
  };

  const legalIssueTypes = [
    'Property Rights',
    'Labor Rights',
    'Family Law',
    'Consumer Rights',
    'Healthcare Rights',
    'Education Rights',
    'Criminal Law',
    'Civil Rights',
    'Business Law',
    'Immigration Law',
    'Other'
  ];

  const experiencedLawyers = [
    {
      name: 'Advocate Priya Sharma',
      specialization: 'Family Law & Property Rights',
      experience: '12 years',
      rating: 4.8,
      languages: ['Hindi', 'English', 'Punjabi'],
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Advocate Rajesh Kumar',
      specialization: 'Labor Rights & Consumer Protection',
      experience: '15 years',
      rating: 4.9,
      languages: ['Hindi', 'English', 'Bengali'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Advocate Meera Patel',
      specialization: 'Healthcare Rights & Civil Law',
      experience: '10 years',
      rating: 4.7,
      languages: ['Hindi', 'English', 'Gujarati'],
      image: 'https://images.unsplash.com/photo-1594824388863-d2ce92670e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h2><TranslatableText text="Consultation Request Submitted Successfully!" /></h2>
          <p><TranslatableText text="Our experienced lawyers will contact you within 24 hours to schedule your free consultation." /></p>
          <div className={styles.nextSteps}>
            <h3><TranslatableText text="What happens next?" /></h3>
            <ul>
              <li><TranslatableText text="We'll review your case details" /></li>
              <li><TranslatableText text="Match you with the right lawyer" /></li>
              <li><TranslatableText text="Schedule a convenient time for consultation" /></li>
              <li><TranslatableText text="Receive expert legal advice" /></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← <TranslatableText text="Back to Home" />
        </button>
        <div className={styles.headerContent}>
          <h1><TranslatableText text="Free Legal Consultation" /></h1>
          <p><TranslatableText text="Get expert legal advice from experienced lawyers at no cost. Our initial consultation helps you understand your legal options and rights." /></p>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Consultation Form */}
        <div className={styles.formSection}>
          <h2><TranslatableText text="Request Your Free Consultation" /></h2>
          <form onSubmit={handleSubmit} className={styles.consultationForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">
                <TranslatableText text="Full Name" /> <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">
                <TranslatableText text="Email Address" /> <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">
                <TranslatableText text="Phone Number" /> <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="legalIssue">
                <TranslatableText text="Type of Legal Issue" /> <span className={styles.required}>*</span>
              </label>
              <select
                id="legalIssue"
                name="legalIssue"
                value={formData.legalIssue}
                onChange={handleInputChange}
                required
              >
                <option value="">Select legal issue type</option>
                {legalIssueTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="urgencyLevel">
                <TranslatableText text="Urgency Level" />
              </label>
              <select
                id="urgencyLevel"
                name="urgencyLevel"
                value={formData.urgencyLevel}
                onChange={handleInputChange}
              >
                <option value="low">Low - Can wait a few weeks</option>
                <option value="medium">Medium - Need help within a week</option>
                <option value="high">High - Urgent, need immediate assistance</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="preferredTime">
                <TranslatableText text="Preferred Consultation Time" />
              </label>
              <input
                type="datetime-local"
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">
                <TranslatableText text="Brief Description of Your Case" />
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Please provide a brief description of your legal issue..."
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              <TranslatableText text="Request Free Consultation" />
            </button>
          </form>
        </div>

        {/* Lawyers Section */}
        <div className={styles.lawyersSection}>
          <h2><TranslatableText text="Meet Our Experienced Lawyers" /></h2>
          <div className={styles.lawyersGrid}>
            {experiencedLawyers.map((lawyer, index) => (
              <div key={index} className={styles.lawyerCard}>
                <img src={lawyer.image} alt={lawyer.name} className={styles.lawyerImage} />
                <div className={styles.lawyerInfo}>
                  <h3>{lawyer.name}</h3>
                  <p className={styles.specialization}>{lawyer.specialization}</p>
                  <div className={styles.lawyerDetails}>
                    <span className={styles.experience}>📚 {lawyer.experience}</span>
                    <span className={styles.rating}>⭐ {lawyer.rating}/5</span>
                  </div>
                  <div className={styles.languages}>
                    <strong><TranslatableText text="Languages:" /></strong> {lawyer.languages.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className={styles.benefitsSection}>
          <h2><TranslatableText text="Why Choose Our Free Consultation?" /></h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🆓</div>
              <h3><TranslatableText text="Completely Free" /></h3>
              <p><TranslatableText text="No hidden costs or charges for initial consultation" /></p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>👨‍⚖️</div>
              <h3><TranslatableText text="Experienced Lawyers" /></h3>
              <p><TranslatableText text="Qualified advocates with years of experience" /></p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🔒</div>
              <h3><TranslatableText text="Confidential" /></h3>
              <p><TranslatableText text="All discussions are kept strictly confidential" /></p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>💬</div>
              <h3><TranslatableText text="Multiple Languages" /></h3>
              <p><TranslatableText text="Consultation available in Hindi, English, and regional languages" /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeLegalConsultation;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import TranslatableText from '../components/TranslatableText';
import LegalClinicFinder from '../components/LegalClinicFinder';
import styles from './LocalLegalClinics.module.css';

const LocalLegalClinics = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← <TranslatableText text="Back to Home" />
        </button>
        <div className={styles.headerContent}>
          <h1><TranslatableText text="Local Legal Clinics" /></h1>
          <p><TranslatableText text="Find legal aid clinics and organizations in your area for in-person assistance. Get professional legal help near you." /></p>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <LegalClinicFinder />
        
        {/* Additional Information */}
        <div className={styles.infoSection}>
          <h2><TranslatableText text="About Legal Aid Services" /></h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🏛️</div>
              <h3><TranslatableText text="Government Legal Aid" /></h3>
              <p><TranslatableText text="Free legal services provided by government organizations for eligible citizens" /></p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🤝</div>
              <h3><TranslatableText text="NGO Legal Clinics" /></h3>
              <p><TranslatableText text="Non-profit organizations offering pro bono legal assistance to underserved communities" /></p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>👨‍⚖️</div>
              <h3><TranslatableText text="Bar Association Services" /></h3>
              <p><TranslatableText text="Legal aid programs run by local bar associations with qualified lawyers" /></p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🎓</div>
              <h3><TranslatableText text="Law School Clinics" /></h3>
              <p><TranslatableText text="Legal clinics operated by law schools under supervision of experienced faculty" /></p>
            </div>
          </div>
        </div>

        {/* Eligibility Section */}
        <div className={styles.eligibilitySection}>
          <h2><TranslatableText text="Eligibility for Free Legal Aid" /></h2>
          <div className={styles.eligibilityContent}>
            <div className={styles.eligibilityList}>
              <h3><TranslatableText text="You may be eligible if you:" /></h3>
              <ul>
                <li><TranslatableText text="Annual income is below ₹9,00,000 (as per Legal Services Authorities Act)" /></li>
                <li><TranslatableText text="Belong to a Scheduled Caste or Scheduled Tribe" /></li>
                <li><TranslatableText text="Are a victim of trafficking in human beings or beggar" /></li>
                <li><TranslatableText text="Are a woman or child" /></li>
                <li><TranslatableText text="Are mentally ill or otherwise disabled" /></li>
                <li><TranslatableText text="Are under circumstances of undeserved want such as being a victim of a mass disaster" /></li>
              </ul>
            </div>
            <div className={styles.documentsNeeded}>
              <h3><TranslatableText text="Documents Required:" /></h3>
              <ul>
                <li><TranslatableText text="Income certificate" /></li>
                <li><TranslatableText text="Identity proof (Aadhaar/Voter ID/Passport)" /></li>
                <li><TranslatableText text="Address proof" /></li>
                <li><TranslatableText text="Caste certificate (if applicable)" /></li>
                <li><TranslatableText text="Disability certificate (if applicable)" /></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Services Offered */}
        <div className={styles.servicesSection}>
          <h2><TranslatableText text="Services Offered by Legal Clinics" /></h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceItem}>
              <span className={styles.serviceIcon}>⚖️</span>
              <span><TranslatableText text="Legal Consultation & Advice" /></span>
            </div>
            <div className={styles.serviceItem}>
              <span className={styles.serviceIcon}>📋</span>
              <span><TranslatableText text="Document Drafting & Review" /></span>
            </div>
            <div className={styles.serviceItem}>
              <span className={styles.serviceIcon}>🏛️</span>
              <span><TranslatableText text="Court Representation" /></span>
            </div>
            <div className={styles.serviceItem}>
              <span className={styles.serviceIcon}>🤝</span>
              <span><TranslatableText text="Mediation & Arbitration" /></span>
            </div>
            <div className={styles.serviceItem}>
              <span className={styles.serviceIcon}>📚</span>
              <span><TranslatableText text="Legal Awareness Programs" /></span>
            </div>
            <div className={styles.serviceItem}>
              <span className={styles.serviceIcon}>💼</span>
              <span><TranslatableText text="Pro Bono Legal Services" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalLegalClinics;

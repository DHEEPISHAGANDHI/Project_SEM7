import React from 'react';
import TranslatableText from '../components/TranslatableText';
import styles from './LegalCompanion.module.css';

const LegalCompanion = () => {
  const features = [
    {
      icon: 'fas fa-comments',
      title: 'AI Chat Assistant',
      description: 'Get instant answers to your legal questions with our intelligent chatbot available 24/7.'
    },
    {
      icon: 'fas fa-gavel',
      title: 'Know Your Rights',
      description: 'Explore comprehensive information about your legal rights across different areas of law.'
    },
    {
      icon: 'fas fa-language',
      title: 'Multi-language Support',
      description: 'Access legal information in your preferred language for better understanding.'
    }
  ];

  return (
    <section className={`section ${styles.legalCompanion}`}>
      <div className="container">
        <TranslatableText
          text="Your Legal Companion"
          component="h2"
          className="section-title"
        />
        <TranslatableText
          text="Everything you need to understand and protect your legal rights in one place"
          component="p"
          className="section-subtitle"
        />
        
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.iconContainer}>
                <i className={feature.icon}></i>
              </div>
              <TranslatableText
                text={feature.title}
                component="h3"
                className={styles.featureTitle}
              />
              <TranslatableText
                text={feature.description}
                component="p"
                className={styles.featureDescription}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LegalCompanion;

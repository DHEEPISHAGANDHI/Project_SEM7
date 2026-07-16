import React from 'react';
import TranslatableText from '../components/TranslatableText';
import styles from './LegalCompanion.module.css';

const LegalCompanion = () => {
  const features = [
    {
      icon: 'fas fa-robot',
      title: 'AI Chat Assistant',
      description: 'Get instant answers to your legal questions with our intelligent chatbot available 24/7.',
      color: '#2563eb'
    },
    {
      icon: 'fas fa-scale-balanced',
      title: 'Know Your Rights',
      description: 'Explore comprehensive information about your legal rights across different areas of law.',
      color: '#163a72'
    },
    {
      icon: 'fas fa-language',
      title: 'Multi-language Support',
      description: 'Access legal information in your preferred language for better understanding.',
      color: '#d4a373'
    }
  ];

  return (
    <section className={`section ${styles.legalCompanion}`}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <span className="section-badge">
            <i className="fas fa-star" /> Platform Features
          </span>
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
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${styles.featureCard} reveal reveal-delay-${index + 1}`}
              style={{ '--accent': feature.color }}
            >
              <div className={styles.iconContainer}>
                <i className={feature.icon} />
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
              <div className={styles.cardGlow} aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LegalCompanion;

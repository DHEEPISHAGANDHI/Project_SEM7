import React from 'react';
import { Link } from 'react-scroll';
import TranslatableText from '../components/TranslatableText';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.ambientLeft} aria-hidden="true" />
      <div className={styles.ambientRight} aria-hidden="true" />
      <div className={styles.overlay}>
        <div className={styles.container}>
          <div className={`${styles.content} reveal visible`}>
            <div className={styles.pillRow}>
              <span className={styles.pill}>⚡ 24/7 legal guidance</span>
              <span className={styles.pill}>🌐 Multilingual support</span>
              <span className={styles.pill}>✓ Verified resources</span>
            </div>

            <TranslatableText
              text="Get legal clarity before problems grow"
              component="h1"
              className={styles.title}
            />
            <TranslatableText
              text="A public legal aid hub that helps people understand rights, compare next steps, and act with confidence in the language they trust."
              component="p"
              className={styles.subtitle}
            />

            <div className={styles.actionRow}>
              <Link
                to="know-your-rights"
                spy={true}
                smooth={true}
                offset={-88}
                duration={500}
                className={styles.primaryButton}
              >
                <TranslatableText text="Explore rights" />
                <i className="fas fa-arrow-right" />
              </Link>
              <Link
                to="legal-aid"
                spy={true}
                smooth={true}
                offset={-88}
                duration={500}
                className={styles.secondaryButton}
              >
                <TranslatableText text="View legal services" />
              </Link>
            </div>

            <div className={styles.metrics}>
              <div className={styles.metricCard}>
                <strong>Clear</strong>
                <span>Plain-language answers</span>
              </div>
              <div className={styles.metricCard}>
                <strong>24/7</strong>
                <span>Always available assistance</span>
              </div>
              <div className={styles.metricCard}>
                <strong>India-wide</strong>
                <span>Designed for every region</span>
              </div>
            </div>
          </div>

          <div className={`${styles.visualPanel} reveal reveal-delay-2 visible`}>
            <div className={styles.visualHeader}>
              <span className={styles.visualTag}>Live support</span>
              <span className={styles.visualStatus}>Ready</span>
            </div>

            <div className={styles.visualCard}>
              <div className={styles.visualCardTitle}>Today&apos;s guidance</div>
              <p>Talk to the assistant, review your options, and move to the right legal resource in one calm flow.</p>
            </div>

            <div className={styles.visualStack}>
              <div className={styles.visualStackItem}>
                <span>Case clarity</span>
                <strong>Structured intake</strong>
              </div>
              <div className={styles.visualStackItem}>
                <span>Language access</span>
                <strong>Localized support</strong>
              </div>
              <div className={styles.visualStackItem}>
                <span>Next step</span>
                <strong>Right service match</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

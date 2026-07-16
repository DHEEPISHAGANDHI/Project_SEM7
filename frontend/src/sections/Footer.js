import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import TranslatableText from '../components/TranslatableText';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.footerGlow} aria-hidden="true" />
      <div className="container">
        <div className={styles.footerTop}>
          <div className={styles.brandBlock}>
            <div className={styles.brandLogo}>
              <i className="fas fa-scale-balanced" />
              <span>LegalAid India</span>
            </div>
            <p className={styles.brandTagline}>
              <TranslatableText text="Making legal information accessible to every Indian citizen." />
            </p>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook" className={styles.socialLink}>
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" aria-label="Twitter" className={styles.socialLink}>
                <i className="fab fa-x-twitter" />
              </a>
              <a href="#" aria-label="LinkedIn" className={styles.socialLink}>
                <i className="fab fa-linkedin-in" />
              </a>
              <a href="#" aria-label="Instagram" className={styles.socialLink}>
                <i className="fab fa-instagram" />
              </a>
            </div>
          </div>

          <div className={styles.footerSection}>
            <TranslatableText text="Quick Links" component="h3" />
            <ul>
              <li><a href="/#home"><TranslatableText text="Home" /></a></li>
              <li><a href="/#know-your-rights"><TranslatableText text="Know Your Rights" /></a></li>
              <li><a href="/#legal-aid"><TranslatableText text="Legal Aid Services" /></a></li>
              <li><RouterLink to="/legal-helpline"><TranslatableText text="Legal Helpline" /></RouterLink></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <TranslatableText text="Legal Topics" component="h3" />
            <ul>
              <li><RouterLink to="/property-rights"><TranslatableText text="Property Rights" /></RouterLink></li>
              <li><a href="/#know-your-rights"><TranslatableText text="Labor Laws" /></a></li>
              <li><a href="/#know-your-rights"><TranslatableText text="Family Law" /></a></li>
              <li><a href="/#know-your-rights"><TranslatableText text="Consumer Rights" /></a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <TranslatableText text="Connect With Us" component="h3" />
            <div className={styles.contactInfo}>
              <p><i className="fas fa-envelope" /> info@legalaidindia.org</p>
              <p><i className="fas fa-phone" /> <TranslatableText text="Toll-free: 1800-LEGAL-AID" /></p>
              <p><i className="fas fa-location-dot" /> <TranslatableText text="New Delhi, India" /></p>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {currentYear} LegalAid India. <TranslatableText text="All rights reserved." /></p>
          <div className={styles.footerLinks}>
            <a href="#"><TranslatableText text="Privacy Policy" /></a>
            <a href="#"><TranslatableText text="Terms of Service" /></a>
            <a href="#"><TranslatableText text="Disclaimer" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import TranslatableText from '../components/TranslatableText';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer id="contact" className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <TranslatableText text="Quick Links" component="h3" />
            <ul>
              <li><a href="#home"><TranslatableText text="Home" /></a></li>
              <li><a href="#know-your-rights"><TranslatableText text="Know Your Rights" /></a></li>
              <li><a href="#legal-aid"><TranslatableText text="Legal Aid Services" /></a></li>
              <li><a href="#contact"><TranslatableText text="Contact Us" /></a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <TranslatableText text="Legal Topics" component="h3" />
            <ul>
              <li><a href="#"><TranslatableText text="Property Rights" /></a></li>
              <li><a href="#"><TranslatableText text="Labor Laws" /></a></li>
              <li><a href="#"><TranslatableText text="Family Law" /></a></li>
              <li><a href="#"><TranslatableText text="Consumer Rights" /></a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <TranslatableText text="Connect With Us" component="h3" />
            <div className={styles.contactInfo}>
              <p><i className="fas fa-envelope"></i> info@legalaidindia.org</p>
              <p><i className="fas fa-phone"></i> <TranslatableText text="Toll-free: 1800-LEGAL-AID" /></p>
              <p><i className="fas fa-map-marker-alt"></i> <TranslatableText text="New Delhi, India" /></p>
            </div>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p><TranslatableText text="© 2024 LegalAid India. All rights reserved." /></p>
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

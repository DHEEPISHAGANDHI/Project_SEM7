import React from 'react';
import { Link } from 'react-scroll';
import {Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import TranslatableText from '../components/TranslatableText';
import styles from './Navbar.module.css';

const Navbar = ({ onLanguageClick, currentLanguage, onOpenAssistant, onOpenAuth }) => {
  const { getSupportedLanguages } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const navItems = [
    { to: 'home', label: 'Home' },
    { to: 'know-your-rights', label: 'KYR' },
    { to: 'contact', label: 'Contact Us' }
  ];

  // Get the current language display name
  const languages = getSupportedLanguages();
  const currentLangObj = languages.find(lang => lang.code === currentLanguage);
  const currentLangDisplay = currentLangObj ? currentLangObj.native : currentLanguage.toUpperCase();

  // Handle dashboard navigation based on user role
  const handleDashboardClick = () => {
    if (!isAuthenticated || !user) return;
    
    switch (user.role) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'lawyer':
        navigate('/lawyer-dashboard');
        break;
      case 'user':
      default:
        navigate('/user-dashboard');
        break;
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brandGroup}>
          <RouterLink to="/" className={styles.logo}>
            <span className={styles.logoMark} aria-hidden="true">L</span>
            <span className={styles.logoCopy}>
              <span className={styles.logoTitle}><TranslatableText text="LegalAid India" /></span>
              <span className={styles.logoSubtitle}><TranslatableText text="Legal guidance, made clear" /></span>
            </span>
          </RouterLink>
        </div>

        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
              activeClass={styles.active}
              className={styles.navLink}
            >
              <TranslatableText text={item.label} />
            </Link>
          ))}
        </div>

        <div className={styles.rightSection}>
          <button
            className={styles.assistantButton}
            onClick={onOpenAssistant}
          >
            <i className="fas fa-sparkles"></i>
            <TranslatableText text="Ask Assistant" />
          </button>

          <button 
            className={styles.languageButton}
            onClick={onLanguageClick}
          >
            <i className="fas fa-globe"></i>
            {currentLangDisplay}
            <i className="fas fa-chevron-down"></i>
          </button>
          
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button 
                className={styles.dashboardButton}
                onClick={handleDashboardClick}
              >
                <i className="fas fa-tachometer-alt"></i>
                <TranslatableText text="My Dashboard" />
              </button>
              <div className={styles.userInfo}>
                <span className={styles.userName}>
                  <TranslatableText text="Hello," /> {user?.name}
                </span>
              </div>
              <button className={styles.logoutButton} onClick={logout}>
                <i className="fas fa-sign-out-alt"></i>
                <TranslatableText text="Logout" />
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button 
                className={styles.authButton}
                onClick={() => onOpenAuth('login')}
              >
                <i className="fas fa-user"></i>
                <TranslatableText text="Login" />
              </button>
            </div>
          )}

          <RouterLink
            to="/legal-helpline"
            className={styles.getHelpButton}
          >
            <TranslatableText text="Get Help Now" />
          </RouterLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

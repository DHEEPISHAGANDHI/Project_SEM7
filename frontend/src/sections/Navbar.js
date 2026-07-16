import React, { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import TranslatableText from '../components/TranslatableText';
import styles from './Navbar.module.css';

const Navbar = ({ onLanguageClick, currentLanguage, onOpenAssistant, onOpenAuth }) => {
  const { getSupportedLanguages } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isHomePage && location.hash) {
      const targetId = location.hash.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [location, isHomePage]);

  const navItems = [
    { to: 'home', label: 'Home' },
    { to: 'know-your-rights', label: 'Know Your Rights' },
    { to: 'legal-aid', label: 'Legal Aid' },
    { to: 'contact', label: 'Contact' }
  ];

  const languages = getSupportedLanguages();
  const currentLangObj = languages.find(lang => lang.code === currentLanguage);
  const currentLangDisplay = currentLangObj ? currentLangObj.native : currentLanguage.toUpperCase();

  const handleDashboardClick = () => {
    if (!isAuthenticated || !user) return;
    switch (user.role) {
      case 'admin': navigate('/admin-dashboard'); break;
      case 'lawyer': navigate('/lawyer-dashboard'); break;
      default: navigate('/user-dashboard'); break;
    }
    setMobileOpen(false);
  };

  const renderNavLink = (item) => {
    const linkClass = styles.navLink;
    if (isHomePage) {
      return (
        <Link
          key={item.to}
          to={item.to}
          spy={true}
          smooth={true}
          offset={-88}
          duration={500}
          activeClass={styles.active}
          className={linkClass}
          onClick={() => setMobileOpen(false)}
        >
          <TranslatableText text={item.label} />
        </Link>
      );
    }
    return (
      <RouterLink
        key={item.to}
        to={`/#${item.to}`}
        className={linkClass}
        onClick={() => setMobileOpen(false)}
      >
        <TranslatableText text={item.label} />
      </RouterLink>
    );
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.brandGroup}>
          <RouterLink to="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
            <span className={styles.logoMark} aria-hidden="true">
              <i className="fas fa-scale-balanced" />
            </span>
            <span className={styles.logoCopy}>
              <span className={styles.logoTitle}>
                <TranslatableText text="LegalAid India" />
              </span>
              <span className={styles.logoSubtitle}>
                <TranslatableText text="Legal guidance, made clear" />
              </span>
            </span>
          </RouterLink>
        </div>

        <div className={`${styles.navLinks} ${mobileOpen ? styles.navLinksOpen : ''}`}>
          {navItems.map(renderNavLink)}

          <div className={styles.mobileActions}>
            <button className={styles.assistantButton} onClick={() => { onOpenAssistant(); setMobileOpen(false); }}>
              <i className="fas fa-wand-magic-sparkles" />
              <TranslatableText text="Ask Assistant" />
            </button>
            <button className={styles.languageButton} onClick={() => { onLanguageClick(); setMobileOpen(false); }}>
              <i className="fas fa-globe" />
              {currentLangDisplay}
            </button>
            {isAuthenticated ? (
              <>
                <button className={styles.dashboardButton} onClick={handleDashboardClick}>
                  <i className="fas fa-gauge-high" />
                  <TranslatableText text="My Dashboard" />
                </button>
                <button className={styles.logoutButton} onClick={() => { logout(); setMobileOpen(false); }}>
                  <i className="fas fa-right-from-bracket" />
                  <TranslatableText text="Logout" />
                </button>
              </>
            ) : (
              <button className={styles.authButton} onClick={() => { onOpenAuth('login'); setMobileOpen(false); }}>
                <i className="fas fa-user" />
                <TranslatableText text="Login" />
              </button>
            )}
            <RouterLink to="/legal-helpline" className={styles.getHelpButton} onClick={() => setMobileOpen(false)}>
              <TranslatableText text="Get Help Now" />
            </RouterLink>
          </div>
        </div>

        <div className={styles.rightSection}>
          <button className={styles.assistantButton} onClick={onOpenAssistant}>
            <i className="fas fa-wand-magic-sparkles" />
            <span className={styles.desktopOnly}><TranslatableText text="Ask Assistant" /></span>
          </button>

          <button className={styles.languageButton} onClick={onLanguageClick}>
            <i className="fas fa-globe" />
            <span className={styles.desktopOnly}>{currentLangDisplay}</span>
            <i className={`fas fa-chevron-down ${styles.chevron}`} />
          </button>

          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button className={styles.dashboardButton} onClick={handleDashboardClick}>
                <i className="fas fa-gauge-high" />
                <span className={styles.desktopOnly}><TranslatableText text="Dashboard" /></span>
              </button>
              <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
              <button className={styles.logoutButton} onClick={logout} aria-label="Logout">
                <i className="fas fa-right-from-bracket" />
              </button>
            </div>
          ) : (
            <button className={styles.authButton} onClick={() => onOpenAuth('login')}>
              <i className="fas fa-user" />
              <span className={styles.desktopOnly}><TranslatableText text="Login" /></span>
            </button>
          )}

          <RouterLink to="/legal-helpline" className={styles.getHelpButton}>
            <TranslatableText text="Get Help" />
          </RouterLink>

          <button
            className={`${styles.menuToggle} ${mobileOpen ? styles.menuToggleOpen : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

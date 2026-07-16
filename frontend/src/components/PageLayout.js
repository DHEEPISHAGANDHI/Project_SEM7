import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import Chatbot from './Chatbot';
import LanguageModal from './LanguageModal';
import AuthModal from './auth/AuthModal';
import { useGlobalLanguage } from '../contexts/GlobalLanguageContext';
import styles from './PageLayout.module.css';

const PageLayout = ({ children, showChatbot = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const { currentLanguage, changeLanguage } = useGlobalLanguage();
  const navigate = useNavigate();

  const handleLanguageSelect = (languageCode) => {
    changeLanguage(languageCode);
    setIsModalOpen(false);
  };

  const handleOpenAuth = () => setIsAuthModalOpen(true);

  return (
    <div className={styles.pageLayout}>
      <Navbar
        onLanguageClick={() => setIsModalOpen(true)}
        currentLanguage={currentLanguage}
        onOpenAssistant={() => setAssistantOpen(true)}
        onOpenAuth={handleOpenAuth}
      />
      <div className={styles.pageContent}>
        {children}
      </div>
      <Footer />
      {showChatbot && (
        <Chatbot
          isOpen={assistantOpen}
          onOpen={() => setAssistantOpen(true)}
          onClose={() => setAssistantOpen(false)}
        />
      )}
      <LanguageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLanguageSelect={handleLanguageSelect}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <button
        className={styles.backHome}
        onClick={() => navigate('/')}
        aria-label="Back to home"
      >
        <i className="fas fa-arrow-left" />
        <span>Home</span>
      </button>
    </div>
  );
};

export default PageLayout;

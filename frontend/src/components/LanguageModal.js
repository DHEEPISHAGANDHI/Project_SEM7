import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from '../hooks/useTranslation';
import styles from './LanguageModal.module.css';

const LanguageModal = ({ isOpen, onClose, onLanguageSelect }) => {
  const { getSupportedLanguages, changeLanguage } = useTranslation();

  if (!isOpen) return null;

  const handleLanguageClick = (languageCode) => {
    // Update the translation service language
    changeLanguage(languageCode);
    // Call the parent component's language selection handler
    onLanguageSelect(languageCode);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const languages = getSupportedLanguages();

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Choose Your Language</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className={styles.languageGrid}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={styles.languageButton}
              onClick={() => handleLanguageClick(language.code)}
            >
              <div className={styles.languageName}>{language.name}</div>
              <div className={styles.languageNative}>{language.native}</div>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LanguageModal;

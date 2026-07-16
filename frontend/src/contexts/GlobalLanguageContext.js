import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalLanguageContext = createContext();

export const GlobalLanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    // Store in localStorage for persistence
    localStorage.setItem('selectedLanguage', languageCode);
  };

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const value = {
    currentLanguage,
    changeLanguage
  };

  return (
    <GlobalLanguageContext.Provider value={value}>
      {children}
    </GlobalLanguageContext.Provider>
  );
};

export const useGlobalLanguage = () => {
  const context = useContext(GlobalLanguageContext);
  if (!context) {
    throw new Error('useGlobalLanguage must be used within a GlobalLanguageProvider');
  }
  return context;
};

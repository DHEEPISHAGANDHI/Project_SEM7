import { useState, useEffect, useContext, createContext } from 'react';
import translationService from '../services/translationService';

// Create Translation Context
const TranslationContext = createContext();

// Translation Provider Component
export const TranslationProvider = ({ children, initialLanguage = 'en' }) => {
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialLanguage !== currentLanguage) {
      setCurrentLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  const translate = async (text, targetLanguage = currentLanguage) => {
    if (targetLanguage === 'en') {
      return text;
    }

    const cacheKey = `${text}_${targetLanguage}`;
    
    // Check if translation is already cached
    if (translations[cacheKey]) {
      return translations[cacheKey];
    }

    try {
      setIsLoading(true);
      const translation = await translationService.translate(text, targetLanguage);
      
      // Cache the translation
      setTranslations(prev => ({
        ...prev,
        [cacheKey]: translation
      }));
      
      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    } finally {
      setIsLoading(false);
    }
  };

  const translateBatch = async (texts, targetLanguage = currentLanguage) => {
    if (targetLanguage === 'en') {
      return texts;
    }

    try {
      setIsLoading(true);
      const translatedTexts = await translationService.translateBatch(texts, targetLanguage);
      
      // Cache the translations
      const newTranslations = {};
      texts.forEach((text, index) => {
        const cacheKey = `${text}_${targetLanguage}`;
        newTranslations[cacheKey] = translatedTexts[index];
      });
      
      setTranslations(prev => ({
        ...prev,
        ...newTranslations
      }));
      
      return translatedTexts;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts; // Return original texts on error
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
  };

  const getSupportedLanguages = () => {
    return translationService.getSupportedLanguages();
  };

  const value = {
    currentLanguage,
    translations,
    isLoading,
    translate,
    translateBatch,
    changeLanguage,
    getSupportedLanguages
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use translations
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  const { currentLanguage, translate, translateBatch, isLoading } = context;

  // Helper function for immediate translation (for already translated text)
  const t = (text) => {
    const cacheKey = `${text}_${currentLanguage}`;
    return context.translations[cacheKey] || text;
  };

  // Helper function for async translation
  const tAsync = async (text) => {
    return await translate(text, currentLanguage);
  };

  return {
    currentLanguage,
    t,
    tAsync,
    translate,
    translateBatch,
    isLoading,
    changeLanguage: context.changeLanguage,
    getSupportedLanguages: context.getSupportedLanguages
  };
};

// HOC for automatic translation of component text
export const withTranslation = (WrappedComponent) => {
  return function TranslatedComponent(props) {
    const translation = useTranslation();
    
    return (
      <WrappedComponent
        {...props}
        translation={translation}
      />
    );
  };
};

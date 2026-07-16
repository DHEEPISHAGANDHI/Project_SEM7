import React, { useEffect, useState } from "react";
import styles from './GoogleTranslateButton.module.css';

export default function GoogleTranslateAPI() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  // Google Translate API configuration
  // You need to get this API key from Google Cloud Console
  const GOOGLE_TRANSLATE_API_KEY = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY || 'YOUR_API_KEY_HERE';
  const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' }
  ];

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
    
    // Apply translations on page load if not English
    if (savedLanguage !== 'en') {
      translatePage(savedLanguage);
    }
  }, []);

  // Function to translate text using Google Translate API
  const translateText = async (text, targetLang) => {
    if (targetLang === 'en' || !text.trim()) return text;
    
    try {
      const response = await fetch(`${TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations[0].translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      
      // Fallback to MyMemory API if Google API fails
      try {
        const fallbackResponse = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
        );
        const fallbackData = await fallbackResponse.json();
        return fallbackData.responseData.translatedText || text;
      } catch (fallbackError) {
        console.error('Fallback translation error:', fallbackError);
        return text;
      }
    }
  };

  // Function to translate the entire page
  const translatePage = async (targetLang) => {
    setIsTranslating(true);
    
    // Store original texts if not already stored
    const elementsWithText = document.querySelectorAll('[data-original-text]');
    if (elementsWithText.length === 0) {
      // First time - store original texts
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, a, label, li, td, th');
      textElements.forEach(element => {
        if (element.children.length === 0 && element.textContent.trim()) {
          element.setAttribute('data-original-text', element.textContent);
        }
      });
    }

    // Get all elements with original text stored
    const elementsToTranslate = document.querySelectorAll('[data-original-text]');
    
    // If targeting English, restore original texts
    if (targetLang === 'en') {
      elementsToTranslate.forEach(element => {
        element.textContent = element.getAttribute('data-original-text');
      });
      setIsTranslating(false);
      return;
    }

    // Translate elements in batches
    const batchSize = 10;
    const elementsArray = Array.from(elementsToTranslate);
    
    for (let i = 0; i < elementsArray.length; i += batchSize) {
      const batch = elementsArray.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (element) => {
          const originalText = element.getAttribute('data-original-text');
          
          // Skip if text is too short or contains only numbers/symbols
          if (originalText.length < 2 || /^[\d\s\W]+$/.test(originalText)) {
            return;
          }

          try {
            const translatedText = await translateText(originalText, targetLang);
            element.textContent = translatedText;
          } catch (error) {
            console.error('Error translating element:', error);
          }
        })
      );
      
      // Small delay between batches to avoid overwhelming the API
      if (i + batchSize < elementsArray.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    setIsTranslating(false);
  };

  const handleLanguageSelect = async (langCode) => {
    console.log('Translating to:', langCode);
    setCurrentLanguage(langCode);
    localStorage.setItem('selectedLanguage', langCode);
    setIsDropdownOpen(false);
    
    await translatePage(langCode);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getCurrentLanguageInfo = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  return (
    <div className={styles.translateButton}>
      <button 
        className={styles.mainButton} 
        onClick={toggleDropdown}
        disabled={isTranslating}
      >
        <span className={styles.icon}>
          {getCurrentLanguageInfo().flag}
        </span>
        <span className={styles.text}>
          {isTranslating ? 'Translating...' : getCurrentLanguageInfo().name}
        </span>
        <span className={`${styles.arrow} ${isDropdownOpen ? styles.arrowUp : ''}`}>
          ▲
        </span>
      </button>
      
      {isDropdownOpen && (
        <div className={styles.dropdown}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`${styles.languageOption} ${currentLanguage === language.code ? styles.active : ''}`}
              onClick={() => handleLanguageSelect(language.code)}
            >
              <span className={styles.flag}>{language.flag}</span>
              <span className={styles.languageName}>{language.name}</span>
            </button>
          ))}
        </div>
      )}
      
      {isTranslating && (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </div>
  );
}

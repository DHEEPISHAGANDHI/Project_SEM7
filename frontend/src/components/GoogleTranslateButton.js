import React, { useEffect, useState } from "react";
import styles from './GoogleTranslateButton.module.css';

export default function GoogleTranslateButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      // Remove existing script if any
      const existingScript = document.getElementById("google-translate-script");
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      // Define the callback function
      window.googleTranslateElementInit = () => {
        if (!window.google?.translate?.TranslateElement) {
          setTimeout(window.googleTranslateElementInit, 100);
          return;
        }
        
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            includedLanguages: 'en,hi,bn,te,ta,gu,mr,kn,ml,pa,or,as,ur,ne,si'
          },
          "google_translate_element"
        );
      };
    };

    // Add script after component mounts
    const timer = setTimeout(addGoogleTranslateScript, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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

  const handleLanguageSelect = (langCode) => {
    console.log('Attempting to translate to:', langCode);
    setIsDropdownOpen(false);
    
    // Wait for Google Translate to be fully loaded
    const waitForGoogleTranslate = (attempts = 0) => {
      if (attempts > 100) { // Max 10 seconds
        console.log('Google Translate not ready after 10 seconds');
        return;
      }

      const translateCombo = document.querySelector('.goog-te-combo');
      const translateFrame = document.querySelector('.goog-te-gadget-simple');
      
      if (translateCombo) {
        console.log('Found translate combo, setting language to:', langCode);
        translateCombo.value = langCode;
        translateCombo.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }
      
      if (translateFrame) {
        // Try clicking the translate button to open dropdown
        const menuValue = translateFrame.querySelector('.goog-te-menu-value');
        if (menuValue) {
          console.log('Clicking translate menu');
          menuValue.click();
          // Try again after dropdown opens
          setTimeout(() => waitForGoogleTranslate(attempts + 1), 200);
          return;
        }
      }
      
      // Try again
      setTimeout(() => waitForGoogleTranslate(attempts + 1), 100);
    };

    waitForGoogleTranslate();
  };
      }

      const translateElement = document.querySelector('.goog-te-combo');
      console.log('Translate element found:', !!translateElement, 'Options count:', translateElement?.options?.length);
      
      if (translateElement && translateElement.options.length > 1) {
        // Find the correct option value
        let found = false;
        for (let i = 0; i < translateElement.options.length; i++) {
          const optionValue = translateElement.options[i].value;
          console.log('Option', i, ':', optionValue);
          
          if (optionValue.includes('|' + langCode) || optionValue === langCode) {
            console.log('Setting language to:', optionValue);
            translateElement.selectedIndex = i;
            translateElement.dispatchEvent(new Event('change'));
            found = true;
            break;
          }
        }
        
        if (found) {
          setIsDropdownOpen(false);
        } else {
          console.log('Language code not found in options');
          setIsDropdownOpen(false);
        }
      } else {
        // Try again after 100ms
        setTimeout(() => trySetLanguage(attempts + 1), 100);
      }
    };

    trySetLanguage();
  };

  return (
    <>
      {/* Hidden Google Translate Element - must be visible in DOM */}
      <div id="google_translate_element" className={styles.hiddenGoogle}></div>
      
      {/* Custom Floating Language Button */}
      <div className={styles.translateContainer}>
        {/* Language Dropdown */}
        {isDropdownOpen && (
          <div className={styles.languageDropdown}>
            <div className={styles.dropdownHeader}>
              <i className="fas fa-globe"></i>
              <span>Select Language</span>
            </div>
            <div className={styles.languageList}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={styles.languageOption}
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  <span className={styles.languageFlag}>{lang.flag}</span>
                  <span className={styles.languageName}>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Floating Toggle Button */}
        <button 
          className={styles.translateToggle}
          onClick={toggleDropdown}
          aria-label="Change Language"
        >
          <i className="fas fa-language"></i>
          <span className={styles.buttonText}>Translate</span>
        </button>
      </div>
    </>
  );
}

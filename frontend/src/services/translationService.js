// Translation service using Google Translate API
import axios from 'axios';

const GOOGLE_TRANSLATE_API_KEY = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

// Fallback translations for offline/demo mode
const fallbackTranslations = {
  en: {
    'Know Your Rights, Secure Your Future': 'Know Your Rights, Secure Your Future',
    'LegalAid India': 'LegalAid India',
    'Making legal information accessible to every Indian citizen': 'Making legal information accessible to every Indian citizen',
    'Get Started': 'Get Started',
    'Free Legal Consultation': 'Free Legal Consultation',
    'Document Templates': 'Document Templates',
    'Local Legal Clinics': 'Local Legal Clinics',
    'Find a Lawyer': 'Find a Lawyer',
    'Browse Templates': 'Browse Templates',
    'Find Clinics': 'Find Clinics',
    'Get free initial consultation with experienced lawyers to understand your legal options.': 'Get free initial consultation with experienced lawyers to understand your legal options.',
    'Access ready-to-use legal document templates for common legal procedures.': 'Access ready-to-use legal document templates for common legal procedures.',
    'Find legal aid clinics and organizations in your area for in-person assistance.': 'Find legal aid clinics and organizations in your area for in-person assistance.',
  },
  hi: {
    'Know Your Rights, Secure Your Future': 'अपने अधिकारों को जानें, अपने भविष्य को सुरक्षित करें',
    'LegalAid India': 'लीगल एड इंडिया',
    'Making legal information accessible to every Indian citizen': 'हर भारतीय नागरिक के लिए कानूनी जानकारी को सुलभ बनाना',
    'Get Started': 'शुरू करें',
    'Free Legal Consultation': 'मुफ्त कानूनी सलाह',
    'Document Templates': 'दस्तावेज़ टेम्प्लेट',
    'Local Legal Clinics': 'स्थानीय कानूनी क्लिनिक',
    'Find a Lawyer': 'वकील खोजें',
    'Browse Templates': 'टेम्प्लेट देखें',
    'Find Clinics': 'क्लिनिक खोजें',
    'Get free initial consultation with experienced lawyers to understand your legal options.': 'अपने कानूनी विकल्पों को समझने के लिए अनुभवी वकीलों से मुफ्त प्रारंभिक सलाह लें।',
    'Access ready-to-use legal document templates for common legal procedures.': 'सामान्य कानूनी प्रक्रियाओं के लिए तैयार-उपयोग कानूनी दस्तावेज़ टेम्प्लेट तक पहुंच।',
    'Find legal aid clinics and organizations in your area for in-person assistance.': 'व्यक्तिगत सहायता के लिए अपने क्षेत्र में कानूनी सहायता क्लिनिक और संगठन खोजें।',
  },
  ta: {
    'Know Your Rights, Secure Your Future': 'உங்கள் உரிமைகளை அறியுங்கள், உங்கள் எதிர்காலத்தை பாதுகாங்கள்',
    'LegalAid India': 'லீகல் ஏட் இந்தியா',
    'Making legal information accessible to every Indian citizen': 'ஒவ்வொரு இந்திய குடிமகனுக்கும் சட்ட தகவலை அணுகக்கூடியதாக்குதல்',
    'Get Started': 'தொடங்குங்கள்',
    'Free Legal Consultation': 'இலவச சட்ட ஆலோசனை',
    'Document Templates': 'ஆவண டெம்ப்ளேட்கள்',
    'Local Legal Clinics': 'உள்ளூர் சட்ட மருத்துவமனைகள்',
    'Find a Lawyer': 'வழக்கறிஞரைக் கண்டறியவும்',
    'Browse Templates': 'டெம்ப்ளேட்களை உலாவுங்கள்',
    'Find Clinics': 'மருத்துவமனைகளைக் கண்டறியவும்',
    'Get free initial consultation with experienced lawyers to understand your legal options.': 'உங்கள் சட்ட விருப்பங்களைப் புரிந்துகொள்ள அனுபவமிக்க வழக்கறிஞர்களிடமிருந்து இலவச ஆரம்ப ஆலோசனை பெறுங்கள்.',
    'Access ready-to-use legal document templates for common legal procedures.': 'பொதுவான சட்ட நடைமுறைகளுக்கான தயார்-பயன்பாட்டு சட்ட ஆவண டெம்ப்ளேட்களை அணுகவும்.',
    'Find legal aid clinics and organizations in your area for in-person assistance.': 'நேரில் உதவிக்காக உங்கள் பகுதியில் உள்ள சட்ட உதவி மருத்துவமனைகள் மற்றும் நிறுவனங்களைக் கண்டறியவும்.',
  }
};

class TranslationService {
  constructor() {
    this.cache = new Map();
    this.isOnline = navigator.onLine;
    
    // Listen for online/offline events
    window.addEventListener('online', () => { this.isOnline = true; });
    window.addEventListener('offline', () => { this.isOnline = false; });
  }

  // Get cached translation or fallback
  getCachedOrFallback(text, targetLanguage) {
    const cacheKey = `${text}_${targetLanguage}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    // Check fallback translations
    if (fallbackTranslations[targetLanguage] && fallbackTranslations[targetLanguage][text]) {
      return fallbackTranslations[targetLanguage][text];
    }
    
    // Return original text if no translation found
    return text;
  }

  // Translate using Google Translate API
  async translateWithGoogle(text, targetLanguage) {
    if (!GOOGLE_TRANSLATE_API_KEY) {
      console.warn('Google Translate API key not found, using fallback translations');
      return this.getCachedOrFallback(text, targetLanguage);
    }

    try {
      const response = await axios.post(
        `${GOOGLE_TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
        {
          q: text,
          target: targetLanguage,
          source: 'en',
          format: 'text'
        }
      );

      if (response.data && response.data.data && response.data.data.translations) {
        const translation = response.data.data.translations[0].translatedText;
        
        // Cache the translation
        const cacheKey = `${text}_${targetLanguage}`;
        this.cache.set(cacheKey, translation);
        
        return translation;
      }
    } catch (error) {
      console.error('Google Translate API error:', error);
    }

    // Fallback to cached or predefined translations
    return this.getCachedOrFallback(text, targetLanguage);
  }

  // Main translation method
  async translate(text, targetLanguage = 'en') {
    // If target language is English, return original text
    if (targetLanguage === 'en') {
      return text;
    }

    // If offline or no API key, use fallback
    if (!this.isOnline || !GOOGLE_TRANSLATE_API_KEY) {
      return this.getCachedOrFallback(text, targetLanguage);
    }

    // Try Google Translate API
    return await this.translateWithGoogle(text, targetLanguage);
  }

  // Translate multiple texts at once
  async translateBatch(texts, targetLanguage = 'en') {
    if (targetLanguage === 'en') {
      return texts;
    }

    const translations = await Promise.all(
      texts.map(text => this.translate(text, targetLanguage))
    );

    return translations;
  }

  // Translate an object with text values
  async translateObject(obj, targetLanguage = 'en') {
    if (targetLanguage === 'en') {
      return obj;
    }

    const translated = { ...obj };
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        translated[key] = await this.translate(value, targetLanguage);
      } else if (Array.isArray(value)) {
        translated[key] = await this.translateBatch(value, targetLanguage);
      } else if (typeof value === 'object' && value !== null) {
        translated[key] = await this.translateObject(value, targetLanguage);
      }
    }

    return translated;
  }

  // Clear translation cache
  clearCache() {
    this.cache.clear();
  }

  // Get supported languages
  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', native: 'English' },
      { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
      { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
      { code: 'bn', name: 'Bengali', native: 'বাংলা' },
      { code: 'te', name: 'Telugu', native: 'తెలుగు' },
      { code: 'mr', name: 'Marathi', native: 'मराठी' },
      { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
      { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
      { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
      { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
      { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
      { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
      { code: 'ur', name: 'Urdu', native: 'اردو' }
    ];
  }
}

// Create and export a singleton instance
const translationService = new TranslationService();
export default translationService;

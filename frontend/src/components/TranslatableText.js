import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const TranslatableText = ({ 
  text, 
  component: Component = 'span', 
  fallback = null,
  className = '',
  ...props 
}) => {
  const { currentLanguage, translate } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translateText = async () => {
      if (currentLanguage === 'en') {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      try {
        const translation = await translate(text, currentLanguage);
        setTranslatedText(translation);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(fallback || text);
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [text, currentLanguage, translate, fallback]);

  if (isLoading && fallback) {
    return (
      <Component className={className} {...props}>
        {fallback}
      </Component>
    );
  }

  return (
    <Component className={className} {...props}>
      {translatedText}
    </Component>
  );
};

export default TranslatableText;

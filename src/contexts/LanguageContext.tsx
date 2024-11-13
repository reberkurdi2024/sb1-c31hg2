import React, { createContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (language === 'ar') {
      document.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
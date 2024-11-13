import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../translations';

export function useTranslation() {
  const { language } = useContext(LanguageContext);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return { t };
}
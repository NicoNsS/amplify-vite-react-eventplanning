import { de, Translations } from '../i18n/de';

// Einfacher Hook für Übersetzungen
// In einer echten App würde man hier i18next oder ähnliches verwenden
export const useTranslation = () => {
  const t = (path: string, params?: Record<string, string>): string => {
    const keys = path.split('.');
    let current: any = de;

    for (const key of keys) {
      if (current[key] === undefined) {
        return path;
      }
      current = current[key];
    }

    let result = current as string;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`{${key}}`, value);
      });
    }

    return result;
  };

  return { t, translations: de };
};

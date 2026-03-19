import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import kz from '@/locales/kz.json';
import kaa from '@/locales/kaa.json';
import { cloudSet } from '@/lib/cloudStorage';

const savedLang = localStorage.getItem('language') || 'uz';

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
    kz: { translation: kz },
    kaa: { translation: kaa },
  },
  lng: savedLang,
  fallbackLng: 'uz',
  interpolation: { escapeValue: false },
});

export function syncLanguageToCloud(): void {
  const lang = i18n.language;
  cloudSet('language', lang);
}

i18n.on('languageChanged', (lng: string) => {
  localStorage.setItem('language', lng);
  cloudSet('language', lng);
});

export default i18n;

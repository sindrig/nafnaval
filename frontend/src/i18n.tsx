import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      'Your e-mail': 'Your e-mail',
      'Partner e-mail': 'Partner e-mail',
      'Submit': 'Submit',
      'Male': 'Boy',
      'Female': 'Girl',
    },
  },
  is: {
    translation: {
      'Your e-mail': 'Þinn tölvupóstur',
      'Partner e-mail': 'Tölvupóstur maka',
      'Submit': 'Byrja!',
      'Male': 'Drengur',
      'Female': 'Stúlka',
      'Loading...': 'Hleð...',
      'Select': 'Velja',
      'Reject': 'Hafna',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'is',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;
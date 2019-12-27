import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Your e-mail': 'Your e-mail',
      'Partner e-mail': 'Partner e-mail',
      'Submit': 'Submit',
      'Male': 'Boy',
      'Female': 'Girl',
      'Loading...': 'Loading...',
      'Select': 'Select',
      'Reject': 'Reject',
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
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'is',
    lng: 'is',
    keySeparator: false,

    interpolation: {
      escapeValue: false,
    }
  });

  export default i18n;
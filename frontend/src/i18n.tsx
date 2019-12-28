import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Your e-mail': 'Your e-mail',
      'Partner e-mail': 'Partner e-mail',
      'Sign up': 'Sign up',
      'Submit': 'Submit',
      'Male': 'Boy',
      'Female': 'Girl',
      'Loading...': 'Loading...',
      'Select': 'Select',
      'Reject': 'Reject',
      'Save': 'Save',
    },
  },
  is: {
    translation: {
      'Your e-mail': 'Þinn tölvupóstur',
      'Partner e-mail': 'Tölvupóstur maka',
      'Sign up': 'Nýskráning',
      'Submit': 'Byrja!',
      'Male': 'Drengur',
      'Female': 'Stúlka',
      'Loading...': 'Hleð...',
      'Select': 'Velja',
      'Reject': 'Hafna',
      'Save': 'Vista',
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
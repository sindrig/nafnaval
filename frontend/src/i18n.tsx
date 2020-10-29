import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      'Your e-mail': 'Your e-mail',
      'Partner e-mail': 'Partner e-mail',
      'Sign up': 'Sign up',
      Submit: 'Submit',
      Male: 'Boy',
      Both: 'Both',
      Female: 'Girl',
      'Loading...': 'Loading...',
      Select: 'Select',
      Reject: 'Reject',
      Save: 'Save',
      'View selected': 'View selected',
      'View rejected': 'View rejected',
      About: 'About',
      'Unsaved?': 'You have unsaved changes, are you sure you want to leave?',
      'Remove from list': 'Remove from list',
      'View common names': 'View common names',
      'Your progress': 'Your progress',
      'Partner progress': 'Partner progress',
    },
  },
  is: {
    translation: {
      'Your e-mail': 'Þinn tölvupóstur',
      'Partner e-mail': 'Tölvupóstur maka',
      'Sign up': 'Nýskráning',
      Submit: 'Byrja!',
      Male: 'Drengur',
      Both: 'Bæði',
      Female: 'Stúlka',
      'Loading...': 'Hleð...',
      Select: 'Velja',
      Reject: 'Hafna',
      Save: 'Vista',
      'View selected': 'Valin nöfn',
      'View rejected': 'Höfnuð nöfn',
      About: 'Um síðuna',
      'Unsaved?':
        'Þú ert með óvistaðar breytingar, ertu viss um að þú viljir hætta?',
      'Remove from list': 'Taka úr lista',
      'View common names': 'Sameiginlegur listi',
      'Your progress': 'Þín framvinda',
      'Partner progress': 'Framvinda maka',
    },
  },
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'is',
    keySeparator: false,

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

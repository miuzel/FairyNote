import i18n from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import locale_zh_CN from './zh_CN/messages.json'
import locale_en from './en/messages.json'
import { initReactI18next } from 'react-i18next';
export const LoadLocales = (next) => {
  var resources = {
    zh_CN: {
      translation: locale_zh_CN
    },
    en: {
      translation: locale_en
    },
  }
  
  Object.keys(resources).forEach(x => {
    let trans = resources[x].translation
    if (trans) {
      var newTrans = {}
      Object.keys(trans).forEach(k => {
        if ( trans[k].message !== undefined ) {
          newTrans[k] = trans[k].message
        }
      })
      resources[x].translation = newTrans
    }
  })
  
  i18n
    .use(LanguageDetector) 
    .use(initReactI18next) //init i18next
    .init({
      interpolation: {
        // React already does escaping
        escapeValue: false,
      },
      fallbackLng: "en",
      lng: 'zh_CN', 
      debug: false,
      resources: resources
    }).then(next)
}


export default i18n;
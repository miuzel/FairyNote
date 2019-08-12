import i18next from 'i18next';
import locale_zh_CN from './zh_CN/messages.json'
import locale_en from './en/messages.json'

i18next
  .init({
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    lng: 'zh_CN', 
    resources: {
      "zh_CN": {
        translation: locale_zh_CN
      },
      en: {
        translation: locale_en
      },
    },
  })

export const i18nT = (key) => i18next.t(key+".message")
export default i18next
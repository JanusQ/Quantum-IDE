import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translation_en from './en.json'
import translation_zh from './zh.json'

const resources = {
  en: {
    translation: translation_en,
  },
  zh: {
    translation: translation_zh,
  },
}
//得到默认使用的语言
const getDefaultLang = () => {
  let lang =navigator.language.toString().slice(0, 2)
  return lang
  
}
i18n.use(initReactI18next).init({
  resources,
  lng:getDefaultLang(),
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

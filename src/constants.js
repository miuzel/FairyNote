/* global chrome */
import {i18nT} from './_locales/i18n'
import i18n from './_locales/i18n'

const lang = chrome.i18n.getUILanguage().replace('-','_')
let defaultLanguage = 'zh_CN'
for ( let lng in i18n.store.data){
    if(lang === lng) {
        defaultLanguage = lang
        break
    }
}

export const defaultSettings ={
    locale: '',
    autoAddCandidate: true,
    language: defaultLanguage,
    autoSave: true,
    autoNavigating: false,
    defaultMode: "MODE_HOTLINE",
    frequentlyUsedComments: []
}

export const i18nMsg = i18nT
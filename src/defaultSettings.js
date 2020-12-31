/* global chrome */
import i18n from 'i18next'

const lang = chrome.i18n.getUILanguage().replace('-','_')
let defaultLanguage = 'zh_CN'
for ( let lng in i18n.store.data){
    if(lang === lng) {
        defaultLanguage = lang
        break
    }
}

const defaultSettings = {
    locale: '',
    autoAddCandidate: true,
    language: defaultLanguage,
    censorWordEnabled: true,
    autoSave: true,
    autoNavigating: false,
    defaultMode: "MODE_HOTLINE",
    frequentlyUsedComments: []
}

export default defaultSettings
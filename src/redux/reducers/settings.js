/* global chrome */
import * as types from '../actions/types'
import i18n from 'i18next';
import { message } from 'antd';
import defaultSettings from '../../defaultSettings'

import i18next from 'i18next'

const { t } = i18next
const settings = (state = defaultSettings, { type, payload }) => {
    const key = "FairyNote#Settings"
    switch (type) {
    case types.SETTINGS_UPDATE:
        let file = {}
        file[key] = { ...state, ...payload }
        chrome.storage.sync.set(file, () => {})
        return { ...state, ...payload }
    case types.SAVE_SETTINGS:
        file = {}
        file[key] = state
        chrome.storage.sync.set(file, () => {
            message.success(t("saveSuccess"));
        })
        return state
    case types.LOAD_SETTINGS:
        if (payload && payload.language) {
            let lang = 'zh_CN'
            for ( let lng in i18n.store.data){
                if(payload.language === lng) {
                    lang = payload.language
                    break
                }
            }
            i18n.changeLanguage(lang)
        }
        return { ...state, ...payload }
    default:
        return state
    }
}

export default settings
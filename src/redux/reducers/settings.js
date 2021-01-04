/* global chrome */
import * as types from '../actions/types'
import defaultSettings from '../../defaultSettings'


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
            console.log("saveSuccess");
        })
        return state
    case types.LOAD_SETTINGS:

        return { ...state, ...payload }
    default:
        return state
    }
}

export default settings
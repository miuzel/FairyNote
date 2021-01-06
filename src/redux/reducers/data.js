/* global chrome */

import * as types from '../actions/types'
import { getVideoId } from '../../utils'
import LZString from 'lz-string'

const initialState = {
    actors: [],
}
const data =  (state = initialState, { type, payload }) => {
    switch (type) {
        case types.DATA_UPDATE:
            return { ...state, ...payload }
        case types.SAVE_LIST:
            let saveKey = "FairyNote#DataSync"
            let file = {}
            let key = getVideoId()
            let metadata = {
                site: document.domain,
                title: document.title,
                url: document.URL,
                key: key,
                update: Date.now()
            }
            let nextState = state
            if(!nextState.notelist[document.domain]){
                nextState.notelist[document.domain] = {}
            }
            nextState.notelist[document.domain][key] = metadata

            file[saveKey] = LZString.compressToUTF16(JSON.stringify(nextState))
            chrome.storage.local.set(file, () => {
                console.log("data saveSuccess");
            })
            return nextState
        default:
            return state
    }
}

export default data

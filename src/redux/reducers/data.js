/* global chrome */

import * as types from '../actions/types'
import { getVideoId } from '../../utils'

const initialState = {
    actors: [],
}
const data =  (state = initialState, { type, payload }) => {
    const saveKey = "FairyNote#Data"
    switch (type) {
        case types.DATA_UPDATE:
            return { ...state, ...payload }
        case types.SAVE_LIST:
            let file = {}
            let key = getVideoId()
            let metadata = {
                site: document.domain,
                title: document.title,
                url: document.URL,
                key: key
            }
            let nextState = state
            nextState.notelist[key] = metadata
            file[saveKey] = nextState
            chrome.storage.local.set(file, () => {
                console.log("data saveSuccess");
                return
            })
            return state
        default:
            return state
    }
}

export default data

import * as types from '../actions/types'
import {startRevealMagicWord,stopRevealMagicWord} from '../synctimer'

const initialState = {
    mode: '',
    showingHelp: false,
    showingList: false,
    showingSettings: false,
    showingText: false
}

const status = (state = initialState, { type, payload }) => {
    switch (type) {

        case types.TOGGLE_TEXT:
            return {
                ...state,
                showingText: !state.showingText
            }

        case types.TOGGLE_HELP:
            return {
                ...state,
                showingHelp: !state.showingHelp
            }

        case types.TOGGLE_LIST:
            return {
                ...state,
                showingList: !state.showingList
            }
    
        case types.TOGGLE_SETTINGS:
            return {
                ...state,
                showingSettings: !state.showingSettings
            }
        case types.TOGGLE_SYNC_TIMER:
            if(payload.isSyncStarted ){
                startRevealMagicWord()
            }else {
                stopRevealMagicWord()
            }
            return {
                ...state,
                isSyncStarted: payload.isSyncStarted
            }

        case types.TOGGLE_MENU:
            return {
                ...state,
                showingMenu: !state.showingMenu
            }
        default:
            return state
    }
}


export default status
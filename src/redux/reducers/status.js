import * as types from '../actions/types'

const initialState = {
    mode: '',
    showingHelp: false,
    showingSettings: false,
    showingText: false
}

export default (state = initialState, { type, payload }) => {
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

        case types.TOGGLE_SETTINGS:
            return {
                ...state,
                showingSettings: !state.showingSettings
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

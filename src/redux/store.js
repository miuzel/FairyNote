import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import { defaultSettings, i18nMsg } from '../constants'

let initialState = {
    settings: defaultSettings,
    status: {
        showingHelp: false,
        showingSettings: false,
        showingText: false,
        showingMenu: false,
        isSyncStarted: false
    },
    data: {
        actors: [],
    },
    timeline: {
        mode: defaultSettings.defaultMode,
        items: []
    }
}

export default createStore(
    rootReducer ,
    initialState ,
    applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
    ))
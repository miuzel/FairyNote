import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import defaultSettings from '../defaultSettings'

let initialState = {
    settings: defaultSettings,
    status: {
        showingHelp: false,
        showingList: false,
        showingSettings: false,
        showingText: false,
        showingMenu: false,
        isSyncStarted: false
    },
    data: {
        actors: [],
        notelist: []
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
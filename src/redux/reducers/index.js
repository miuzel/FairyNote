import { combineReducers } from 'redux'
import settings from './settings'
import status from './status'
import data from './data'
import timeline from './timeline'


export default combineReducers({
    timeline,
    settings,
    status,
    data
})


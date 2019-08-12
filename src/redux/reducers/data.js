import * as types from '../actions/types'
import { i18nMsg } from '../../constants'

const initialState = {
    actors: [i18nMsg("host")],
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

        case types.DATA_UPDATE:
            return { ...state, ...payload }

        default:
            return state
    }
}

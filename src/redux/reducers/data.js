import * as types from '../actions/types'

const initialState = {
    actors: [],
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

        case types.DATA_UPDATE:
            return { ...state, ...payload }

        default:
            return state
    }
}

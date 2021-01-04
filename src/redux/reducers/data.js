import * as types from '../actions/types'

const initialState = {
    actors: [],
}
const data =  (state = initialState, { type, payload }) => {
    switch (type) {

        case types.DATA_UPDATE:
            return { ...state, ...payload }

        default:
            return state
    }
}

export default data

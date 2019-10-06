import React, { Component } from 'react'
import { Provider } from 'react-redux'
import FairyNoteMarkup from './components/FairyNoteMarkup';
import store from './redux/store'

export class FairyNoteMarkups extends Component {
    render() {
        return (
            <Provider store={store}>
                <FairyNoteMarkup></FairyNoteMarkup>
            </Provider>
        )
    }
}

FairyNoteMarkups.propTypes = {
}


export default FairyNoteMarkups


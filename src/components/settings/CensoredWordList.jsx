import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { settingsUpdate } from '../../redux/actions'
import MyEditableTagGroup from '../inputs/MyEditableTagList';
import { i18nMsg } from '../../constants'

const CensoredWordList = ({ style, censoredWords ,settingsUpdate}) => {
    return (
        <div style={{ ...style}}>
            {i18nMsg("censoredwordlist")}:
            <MyEditableTagGroup 
            style={{ margin: "10px" }} 
            onChange={(data) => settingsUpdate({ censoredWords: data })} 
            tags={censoredWords} />
        </div>
    )
}

const mapStateToProps = (state) => ({
    censoredWords: state.settings.censoredWords ? state.settings.censoredWords : []
})

const mapDispatchToProps = {
    settingsUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(CensoredWordList)

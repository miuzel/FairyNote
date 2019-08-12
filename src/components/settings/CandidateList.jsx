import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { settingsUpdate } from '../../redux/actions'
import MyEditableTagGroup from '../inputs/MyEditableTagList';
import { i18nMsg } from '../../constants'

const CandidateList = ({ style, frequentlyUsedComments ,settingsUpdate}) => {
    return (
        <div style={{ ...style}}>
            {i18nMsg("candidateList")}:
            <MyEditableTagGroup 
            style={{ margin: "10px" }} 
            onChange={(data) => settingsUpdate({ frequentlyUsedComments: data })} 
            tags={frequentlyUsedComments} />
        </div>
    )
}

const mapStateToProps = (state) => ({
    frequentlyUsedComments: state.settings.frequentlyUsedComments
})

const mapDispatchToProps = {
    settingsUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(CandidateList)

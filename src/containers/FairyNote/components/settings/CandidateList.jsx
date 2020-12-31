import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { settingsUpdate } from '../../../../redux/actions'
import MyEditableTagGroup from '../inputs/MyEditableTagList';
import { useTranslation } from 'react-i18next';

const CandidateList = ({ style, frequentlyUsedComments ,settingsUpdate}) => {
    const { t } = useTranslation()
    return (
        <div style={{ ...style}}>
            {t("candidateList")}:
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

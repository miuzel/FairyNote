import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { settingsUpdate } from '../../../../redux/actions'
import MyEditableTagGroup from '../inputs/MyEditableTagList'
import { useTranslation } from 'react-i18next';

const CensoredWordList = ({ style, censoredWords ,settingsUpdate}) => {
    const { t } = useTranslation()
    return (
        <div style={{ ...style}}>
            {t("censoredwordlist")}:
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

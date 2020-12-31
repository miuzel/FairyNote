import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { settingsUpdate } from '../../../../redux/actions'
import { Switch } from 'antd';
import { useTranslation } from 'react-i18next'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
const AutoAddCandidate = ({ style, autoAddCandidate ,settingsUpdate}) => {
    const { t } = useTranslation()
    return (
        <div style={{ ...style}}>
            {t("autoAddCandidate")}:
            <Switch
            style={{ top:"-2px",  marginLeft: "5px",border: "#888 1px solid" }} 
                checkedChildren={<CheckCircleFilled />}
                unCheckedChildren={<CloseCircleFilled />}
                checked={autoAddCandidate}
                onChange={(v)=> settingsUpdate({autoAddCandidate:v})}
            />
        </div>
    )
}

const mapStateToProps = (state) => ({
    autoAddCandidate: state.settings.autoAddCandidate
})

const mapDispatchToProps = {
    settingsUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoAddCandidate)

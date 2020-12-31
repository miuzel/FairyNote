import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { settingsUpdate } from '../../../../redux/actions'
import { Switch } from 'antd';
import { useTranslation } from 'react-i18next'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
const AutoNavigate = ({ style, autoNavigating ,settingsUpdate}) => {
    const { t } = useTranslation()
    return (
        <div style={{ ...style}}>
            {t("autonavigating")}:
            <Switch
            style={{ top:"-2px",  marginLeft: "5px",border: "#888 1px solid" }} 
                checkedChildren={<CheckCircleFilled />}
                unCheckedChildren={<CloseCircleFilled />}
                checked={autoNavigating}
                onChange={(v)=> settingsUpdate({autoNavigating:v})}
            />
        </div>
    )
}

const mapStateToProps = (state) => ({
    autoNavigating: state.settings.autoNavigating
})

const mapDispatchToProps = {
    settingsUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoNavigate)

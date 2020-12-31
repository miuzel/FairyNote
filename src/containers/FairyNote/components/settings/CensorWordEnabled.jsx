import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { settingsUpdate } from '../../../../redux/actions'
import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';


const CensorWordEnabled = ({ style, censorWordEnabled ,settingsUpdate}) => {
    const { t } = useTranslation()
    return (
        <div style={{ ...style}}>
            {t("censorwordenabled")}:
            <Switch
            style={{ top:"-2px",  marginLeft: "5px",border: "#888 1px solid" }} 
                checkedChildren={<CheckCircleFilled type="check" />}
                unCheckedChildren={<CloseCircleFilled type="close" />}
                checked={censorWordEnabled}
                onChange={(v)=> settingsUpdate({censorWordEnabled:v})}
            />
        </div>
    )
}

const mapStateToProps = (state) => ({
    censorWordEnabled: state.settings.censorWordEnabled
})

const mapDispatchToProps = {
    settingsUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(CensorWordEnabled)

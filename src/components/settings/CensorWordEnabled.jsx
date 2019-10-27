import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { settingsUpdate } from '../../redux/actions'
import { Switch ,Icon} from 'antd';
import { i18nMsg } from '../../constants'

const CensorWordEnabled = ({ style, censorWordEnabled ,settingsUpdate}) => {
    return (
        <div style={{ ...style}}>
            {i18nMsg("censorwordenabled")}:
            <Switch
            style={{ top:"-2px",  marginLeft: "5px",border: "#888 1px solid" }} 
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
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

import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { settingsUpdate } from '../../redux/actions'
import { Switch ,Icon} from 'antd';
import { i18nMsg } from '../../constants'

const autoSave = ({ style, autoSave ,settingsUpdate}) => {
    return (
        <div style={{ ...style}}>
            {i18nMsg("autoSave")}:
            <Switch
            style={{ top:"-2px",  marginLeft: "5px",border: "#888 1px solid" }} 
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                checked={autoSave}
                onChange={(v)=> settingsUpdate({autoSave:v})}
            />
        </div>
    )
}

const mapStateToProps = (state) => ({
    autoSave: state.settings.autoSave
})

const mapDispatchToProps = {
    settingsUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(autoSave)

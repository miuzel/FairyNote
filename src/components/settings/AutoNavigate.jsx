import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { settingsUpdate } from '../../redux/actions'
import { Switch ,Icon} from 'antd';
import { i18nMsg } from '../../constants'

const AutoNavigate = ({ style, autoNavigating ,settingsUpdate}) => {
    return (
        <div style={{ ...style}}>
            {i18nMsg("autonavigating")}:
            <Switch
            style={{ top:"-2px",  marginLeft: "5px",border: "#888 1px solid" }} 
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
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

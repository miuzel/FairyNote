import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { settingsUpdate } from '../../redux/actions'
import { Switch ,Icon} from 'antd';
import { i18nMsg } from '../../constants'

const AutoAddCandidate = ({ style, autoAddCandidate ,settingsUpdate}) => {
    return (
        <div style={{ ...style}}>
            {i18nMsg("autoAddCandidate")}:
            <Switch
            style={{ top:"-2px",  marginLeft: "5px",border: "#888 1px solid" }} 
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
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

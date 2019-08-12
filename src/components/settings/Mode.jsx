import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { modes} from '../../redux/modes'
import {settingsUpdate, modeUpdate} from '../../redux/actions'
import { Select } from 'antd';
import { i18nMsg } from '../../constants'
const {Option} = Select

const Mode = ({style,mode,defaultMode, settingsUpdate, type, modeUpdate,container}) => {
    let options = []
    for(let m in modes){
        options.push(
        <Option key={m} value={m}>{i18nMsg(m)}</Option>)
    }
    let onChangeFunc
    let value
    let name
    if(type === 'default'){
        onChangeFunc = (defaultMode) => {settingsUpdate({defaultMode: defaultMode})}
        value = defaultMode
        name = i18nMsg("defaultmode")
    } else {
        onChangeFunc = (mode)=>{modeUpdate({mode})}
        value = mode
        name = i18nMsg("mode")
    }
    return (
        <div style={{...style}}>
            {name+":"}
            <Select size="small" 
            value={value}
            style={{ width: 120 ,marginLeft: "5px"}} 
            onChange={onChangeFunc}
            getPopupContainer={()=>container}
            >
            {options}
            </Select>
        </div>
    )
}

const mapStateToProps = (state) => ({
    mode: state.timeline.mode,
    defaultMode: state.settings.defaultMode
})

const mapDispatchToProps = {
    modeUpdate,
    settingsUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(Mode)

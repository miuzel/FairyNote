import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { modes} from '../../../../redux/modes'
import { settingsUpdate, modeUpdate } from '../../../../redux/actions'
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
const { Option } = Select

const Mode = ({style,mode,defaultMode, settingsUpdate, type, modeUpdate,container}) => {
    const { t } = useTranslation()
    let options = []
    for(let m in modes){
        options.push(
        <Option key={m} value={m}>{t(m)}</Option>)
    }
    let onChangeFunc
    let value
    let name
    if(type === 'default'){
        onChangeFunc = (defaultMode) => {settingsUpdate({defaultMode: defaultMode})}
        value = defaultMode
        name = t("defaultmode")
    } else {
        onChangeFunc = (mode)=>{modeUpdate({mode})}
        value = mode
        name = t("mode")
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

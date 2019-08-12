import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '../../_locales/i18n'
import {settingsUpdate} from '../../redux/actions'
import { Select } from 'antd';
import { i18nMsg } from '../../constants'
const {Option} = Select

const Language = ({style,language, settingsUpdate,container}) => {
    let options = []
    for(let m in i18n.store.data){
        options.push(
        <Option key={m} value={m}>{i18nMsg(m)}</Option>)
    }
    let onChangeFunc
    let name
    onChangeFunc = (language) => {
        settingsUpdate({language: language})
        i18n.changeLanguage(language)
    }
    name = i18nMsg("language")
    return (
        <div style={{...style}}>
            {name+":"}
            <Select size="small" 
            value={i18nMsg(language)}
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
    language: state.settings.language
})

const mapDispatchToProps = {
    settingsUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(Language)

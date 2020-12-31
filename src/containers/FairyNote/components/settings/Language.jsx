import React from 'react'
import i18n from 'i18next'
import { connect } from 'react-redux'
import { settingsUpdate } from '../../../../redux/actions'
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
const {Option} = Select

const Language = ({style,language, settingsUpdate,container}) => {
    const { t } = useTranslation()
    let options = []
    for(let m in i18n.store.data){
        options.push(
        <Option key={m} value={m}>{t(m)}</Option>)
    }
    let onChangeFunc
    let name
    onChangeFunc = (language) => {
        settingsUpdate({language: language})
        i18n.changeLanguage(language)
    }
    name = t("language")
    return (
        <div style={{...style}}>
            {name+":"}
            <Select size="small" 
            value={t(language)}
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

import React, { Component } from 'react'
import { InputNumber } from 'antd';
import { withTranslation } from 'react-i18next'
import moment from 'moment'

@withTranslation()
class MyTimePicker extends Component {
    // Just show the latest item.
    handleTimeChange(ts){
      if(ts){
        this.props.onChange(ts)
      } else {
        this.props.onChange(0)
      }
    }
    render() {
        const {t} = this.props
        let inputNumber = (
            <InputNumber 
              style={{ width: this.props.width, marginRight: "10px" }}
              size="small"
              placeholder={t("pickTime")}
              value={this.props.value}
              formatter={ value => `${moment.utc(0).seconds(value).format("HH:mm:ss")}`}
              parser={ value => {
                  let t = value.replace(/[^\d:]/g, '')
                  if (t.match(/^\d{2}:\d{2}:\d{2}$/)){
                    let s = t.split(":")
                    return s[0].substr(0,2)*3600+s[1].substr(0,2)*60+s[2].substr(0,2)*1
                  } else {
                    return this.props.value
                  }
                }
              }
              onFocus={this.props.onFocus}
              onChange={this.handleTimeChange.bind(this)}
            />
        )
        return inputNumber
    }
}

export default MyTimePicker
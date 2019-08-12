import React, { Component } from 'react'
import { TimePicker, Button } from 'antd'
import { i18nMsg } from '../../constants'
import moment from 'moment'

export default class MyTimePicker extends Component {
    // Just show the latest item.
    state = {
      open: false
    }
    hendleOpenChange = (status) => this.setState({open:status})
    handleClose = () => {
      this.setState({ open: false })
      this.props.onBlur()
    }
    handleTimeChange(ts){
      if(ts){
        this.props.onChange((ts - moment.utc(0) )/1000)
      } else {
        this.props.onChange(0)
      }
    }
    render() {
        return (
            <TimePicker style={{ width: this.props.width, marginRight: "10px" }}
                open={this.state.open}
                value={typeof(this.props.value) === 'number' ? moment.utc(0).seconds(this.props.value) : null}
                size="small"
                placeholder={i18nMsg("pickTime")}
                allowClear={false}
                onChange={this.handleTimeChange.bind(this)}
                onOpenChange={this.hendleOpenChange}
                onFocus={this.props.onFocus}
                onBlur={this.props.onBlur}
                addon={
                    () => (
                        <Button
                            ize="small"
                            type="primary"
                            onClick={this.handleClose}
                        >{i18nMsg("OK")}</Button>
                    )
                }
                getPopupContainer={() => this.props.container}
            />
        )
    }
}

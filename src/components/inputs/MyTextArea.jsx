import React, { Component } from 'react'
import { Input } from 'antd'
const { TextArea } = Input
export default class MyTextArea extends Component {
    textArea = React.createRef()
    handleTextChange(e){
      let value = ""
      if(e && e.target && typeof(e.target.value) !== "undefined"){
        value =e.target.value
      }
      this.props.onChange(value)
    }
    render() {
        return (
            <TextArea placeholder={this.props.placeholder}
                ref={this.textArea}
                value={this.props.value}
                onFocus={this.props.onFocus}
                size="small" 
                className = {this.props.className}
                // some how this function will miss this object so 
                // unnessesarily bind here..
                onChange={this.handleTextChange.bind(this)}
                autosize
            ></TextArea>
        )
    }
}
import React, { Component } from 'react'
import { Input } from 'antd'
const { TextArea } = Input
export default class MyTextArea extends Component {
    state = {
      value: this.props.value,
      dirty: false
    }
    textArea = React.createRef()
    handleTextChange(e){
      let value = ""
      if(e && e.target && typeof(e.target.value) !== "undefined"){
        value = e.target.value
      }
      this.setState({value,dirty:true})
    }
    handleBlur(){
      if(this.state.dirty){
        this.setState({dirty:false})
        this.props.onChange(this.state.value)
      }
    }
    render() {
        return (
            <TextArea placeholder={this.props.placeholder}
                ref={this.textArea}
                value={this.state.dirty ? this.state.value : this.props.value}
                onFocus={this.props.onFocus}
                onBlur={this.handleBlur.bind(this)}
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

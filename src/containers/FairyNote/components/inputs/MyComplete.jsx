import React from 'react';
import { AutoComplete } from 'antd';

class MyComplete extends React.Component {
  state = {
    candidates: {
      dataSource: this.props.dataSource
    },
    value: this.props.value,
    dirty: false
  };
  handleSearch = q => {
    let res = [];
    if (typeof(q) === "string") {
      if (this.props.fixed){
        res = this.props.dataSource.slice()
      } else {
        for (var t of this.props.dataSource) {
          if (t.indexOf(q) >= 0) {
            res.push(t);
          }
        }
      }
    } else {
      res = this.props.dataSource
    }
    this.setState({
      candidates: {
        dataSource: res
      }
    })
  }
  handleChange(value){
    this.setState({value,dirty:true})
  }
  handleBlur(){
    if(this.state.dirty){
      this.setState({dirty:false})
      this.props.onChange(this.state.value)
    }
    if(this.props.onBlur){
      this.props.onBlur()
    }
  }
  render() {
    const { dataSource } = this.state.candidates;
    return (
      <AutoComplete
        options={dataSource.map(x=>{return {value:x}})}
        style={{ width: this.props.width , marginRight: "10px"}}
        size="small"
        value={this.state.dirty ? this.state.value : this.props.value}
        prefix={this.props.prefix}
        onSearch={this.handleSearch}
        placeholder={this.props.placeholder}
        onChange={this.handleChange.bind(this)}
        onBlur={this.handleBlur.bind(this)}
        onFocus={this.props.onFocus}
        getPopupContainer={() => this.props.container}
      />
    );
  }
}

export default MyComplete
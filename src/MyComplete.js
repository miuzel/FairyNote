import React from 'react';
import { AutoComplete } from 'antd';

class MyComplete extends React.Component {
  state = {
    candidates: {
      dataSource: this.props.dataSource
    },
  };
  handleSearch = q => {
    let res = [];
    if (q) {
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
  render() {
    const { dataSource } = this.state.candidates;
    return (
      <AutoComplete
        dataSource={dataSource}
        style={{ width: this.props.width , marginRight: "10px"}}
        size="small"
        value={this.props.value}
        prefix={this.props.prefix}
        onSearch={this.handleSearch}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
        onFocus={this.props.onFocus}
        getPopupContainer={() => this.props.container}
      />
    );
  }
}
export default MyComplete
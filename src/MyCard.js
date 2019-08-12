/* global chrome */
import React, { Component } from 'react'

import { Button, Timeline, Icon, Card, Popover ,Tooltip} from 'antd'
import "./mycard.css"
import MyComplete from './MyComplete'
import MyTimePicker from './MyTimePicker'
import MyTextarea from './MyTextArea';

export default class MyCard extends Component {
  textArea = React.createRef()
  handleFocus = () => this.props.handleFocus(this.key)
  handleCardChange(key, value){
    this.props.handleCardChange(key,value)
  }
  componentDidUpdate(prevProps, prevState){
    if (this.props.active && !prevProps.active){
      this.textArea.current.textArea.current.textAreaRef.select()
    }
  }
  componentDidMount(){
    if (this.props.active){
      this.textArea.current.textArea.current.textAreaRef.select()
    }
    // let ta = document.querySelector(".ext-textarea" + this.key)
    // if (this.props.active && ta) {
    //   ta.select()
    // }
  }
  render() {
    let icon = ""
    if (this.props.active ) {
     icon = <Icon type="clock-circle-o" style={{ fontSize: '16px' } } />
    } 
    let timepicker = (
      <MyTimePicker
        width = "90px"
        value={this.props.cardData.timestamp}
        onChange={this.handleCardChange.bind(this, "timestamp")}
        onFocus={this.handleFocus}
        onBlur={this.props.handleTimeChange}
        container={this.props.container}
      ></MyTimePicker>
    )
    let actor = (
      <MyComplete
        width="88px"
        prefix="user"
        placeholder={chrome.i18n.getMessage("guest")}
        fixed
        value={this.props.cardData.actor}
        onChange={this.handleCardChange.bind(this, "actor")}
        onFocus={this.handleFocus}
        dataSource={this.props.actors}
        container={this.props.container}
      ></MyComplete>
    )
    let comment = (
      <MyComplete
        width="150px"
        prefix="user"
        placeholder={chrome.i18n.getMessage("comment")}
        value={this.props.cardData.comment}
        onChange={this.handleCardChange.bind(this, "comment")}
        onFocus={this.handleFocus}
        dataSource={this.props.knownGuests}
        container={this.props.container}
      ></MyComplete>
    )         
    let text = (
      <MyTextarea 
      ref={this.textArea}
      placeholder={chrome.i18n.getMessage("shortDescription")}
      value={this.props.cardData.text}
      onFocus={this.handleFocus}
      onChange={this.handleCardChange.bind(this, "text")}
      className={["memo", "ta" + this.props.cardIndex]}
      ></MyTextarea>
    )
    return (
      <Timeline.Item className="timeline-item" dot={icon} >
        <Card className="content-card"
          style={this.props.active ? { background: "#f0f0f0" } : {}}
          hoverable={true}
          title={
            <div>
              {timepicker}
              {actor}
              {comment}
              <Popover placement="topRight" title={chrome.i18n.getMessage("cardTools")} content={
                <div>
                  <Button size="small" type="link" onClick={this.props.handleCardInsert} tabIndex="-1"><Icon type="copy" theme="filled" />{chrome.i18n.getMessage("copy")}</Button>
                  <Button size="small" type="link" onClick={this.props.handleCardInsert} disabled tabIndex="-1"><Icon type="thunderbolt" theme="filled" />{chrome.i18n.getMessage("latency")}</Button>
                </div>
              } trigger="hover"
                getPopupContainer={() => this.props.container}>
                  <Button size="small" type="link"  tabIndex="-1"><Icon type="setting" theme="filled" /></Button>
              </Popover>
              <Tooltip placement="topRight" title={chrome.i18n.getMessage("jump")}
                getPopupContainer={() => this.props.container}>
                  <Button size="small" type="link" onClick={this.props.handleNavigate} tabIndex="-1"><Icon type="play-square" theme="filled" /></Button>
              </Tooltip>
              <Tooltip placement="topRight" title={chrome.i18n.getMessage("delete")}
                getPopupContainer={() => this.props.container}>
                <Button size="small" type="link" onClick={this.props.handleCardDelete} tabIndex="-1"><Icon type="delete" theme="filled" /></Button>
              </Tooltip>
            </div>
          }
          size="small">
          {text}
        </Card>
      </Timeline.Item>
    )
  }
}
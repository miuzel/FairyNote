import React,{Component} from 'react'
import PropTypes from 'prop-types'
import MyTimePicker from './inputs/MyTimePicker'
import MyComplete from './inputs/MyComplete'
import MyTextArea from './inputs/MyTextArea'
import { modes } from '../redux/modes';
import {  Tooltip, Button, Icon, Timeline, Card } from 'antd';
import { connect } from 'react-redux'
import { itemUpdate, itemFocus, itemDel, itemCopy,videoGoto, settingsUpdate } from '../redux/actions'
import { i18nMsg } from '../constants'

export class FairyNoteTimelineItem extends Component {
  // state ={
  //   show: false
  // }
  static propTypes = {
    index: PropTypes.number,
    item: PropTypes.object,
  } 

  scroll = () => {
    this.cardRef.current.scrollIntoView({behavior: "smooth", block: "nearest"})
    let animate = ()=>{
      if(this.timelineItemRef.current.classList.contains("content-card-enter")){
        this.cardRef.current.scrollIntoView({block: "nearest"})
        setTimeout(animate,100)
      }else{
        this.cardRef.current.scrollIntoView({behavior: "smooth", block: "nearest"})
      }
    } 
    setTimeout(animate,10)
  }
  componentDidMount(){
    if (this.textArea ){
      
      if(this.selectTimeout){
        clearTimeout(this.selectTimeout);
      }
      this.selectTimeout = setTimeout(() => {
        this.scroll()
        this.textArea.current.textArea.current.textAreaRef.focus()
      },0)
      // forwarded to the real textArea
    }
  }
  componentDidUpdate(prevProps){
    if (this.textArea && this.props.active && !prevProps.active){
      // forwarded to the real textArea
      this.scroll()
      this.textArea.current.textArea.current.textAreaRef.focus()
    }
  }
  textArea = React.createRef()
  timelineItemRef = React.createRef()
  cardRef =  React.createRef()
  render() {
    const {
      index,
      itemUpdate,
      settingsUpdate,
      itemFocus,
      itemCopy,
      videoGoto,
      itemDel,
      mode,
      recalls,
      actors,
      frequentlyUsedComments,
      autoNavigating,
      autoAddCandidate,
      container
    } = this.props

    var { item } = this.props

    let icon = ""
    if (!item) {
      item = {
        active: false,
        timestamp: 0,
        actor: "",
        comment: "",
        text: ""
      }
    }
    if (item.active) {
      icon = <Icon type="clock-circle-o" style={{ fontSize: '16px' }} />
    }
    let timepicker = (
      <MyTimePicker
        width="90px"
        value={item.timestamp}
        onChange={value => {
          if (autoNavigating) { videoGoto({ goto: value }) }
          itemUpdate({ index: index, item: { timestamp: value } })
        }}
        onFocus={() => itemFocus({ index: index })}
        container={container}
      ></MyTimePicker>
    )
    let actor = (
      <MyComplete
        width="118px"
        prefix="user"
        placeholder={i18nMsg("guest")}
        value={item.actor}
        onChange={value => itemUpdate({ index: index, item: { actor: value } })}
        onFocus={() => itemFocus({ index: index })}
        dataSource={
          [...new Set( [...actors,
            ...modes[mode].getDefaultCandidates(),
            ...recalls])]}
        container={container}
      ></MyComplete>
    )
    let comment = (
      <MyComplete
        width="160px"
        prefix="user"
        placeholder={i18nMsg("comment")}
        value={item.comment}
        onChange={value => {
          itemUpdate({ index: index, item: { comment: value } })
        }}
        onBlur={() => {
          if(autoAddCandidate){
            settingsUpdate({
              frequentlyUsedComments: frequentlyUsedComments
                  .concat([item.comment]
                  .filter(x => typeof(x) === "string" && x !== "" && -1 === frequentlyUsedComments.indexOf(x)))
                        })
          }
        }}
        onFocus={() => itemFocus({ index: index })}
        dataSource={frequentlyUsedComments}
        container={container}
      ></MyComplete>
    )
    let text = (
      <MyTextArea
        ref={this.textArea}
        placeholder={i18nMsg("shortDescription")}
        value={item.text}
        onFocus={() => itemFocus({ index: index })}
        onChange={value => itemUpdate({ index: index, item: { text: value } })}
        className={["memo", "ta" + index]}
      ></MyTextArea>
    )
    return (
      <div 
      ref={this.timelineItemRef} className="content-card" >
      <Timeline.Item className="timeline-item" dot={icon} style={{
        padding: "0 0 0px 0",
        width: "100%"
      }} >
          <div ref={this.cardRef} style={{ top: "-8px", paddingBottom: "10px" }}>
            <Card
              // onClick={()=> itemFocus({ index: index })}
              style={item.active ? { top: "4px", background: "#f0f0f0" } : { top: "4px" }}
              hoverable={true}
              title={
                <div>
                  {timepicker}
                  {actor}
                  {comment}
                </div>
              }
              size="small">
              {text}
            </Card>
            <span id="cardcontrol" style={{ position: "fixed", top: 5, right: 0, margin: "0 10px" }}
              width="auto">
              <Tooltip placement="topRight" title={i18nMsg("jump")}
                getPopupContainer={() => container} >
                <Button size="small" type="link" onClick={() => videoGoto({ goto: item.timestamp })} tabIndex="-1"><Icon type="play-square" /></Button>
              </Tooltip>
              <Tooltip placement="topRight" title={i18nMsg("copy")}
                getPopupContainer={() => container} >
                <Button size="small" type="link" onClick={() => itemCopy({ index: index, item: item })} tabIndex="-1"><Icon type="copy" /></Button>
              </Tooltip>
              <Tooltip placement="topRight" title={i18nMsg("delete")}
                getPopupContainer={() => container} >
                <Button size="small" type="link" onClick={() => itemDel({ index: index })} tabIndex="-1"><Icon type="close-circle" /></Button>
              </Tooltip>
            </span>
          </div>
      </Timeline.Item></div>
    )
  }
}


const mapStateToProps = (state, ownProps) => ({
  recalls: state.timeline.items.map(x=>x.actor).filter(x=>typeof(x) === "string" && x !== ""),
  item: state.timeline.items[ownProps.index],
  mode: state.timeline.mode,
  actors: state.data.actors,
  frequentlyUsedComments: state.settings.frequentlyUsedComments,
  autoNavigating: state.settings.autoNavigating,
  autoAddCandidate: state.settings.autoAddCandidate
})

const mapDispatchToProps = {
  itemUpdate, itemFocus, itemDel, itemCopy,videoGoto,settingsUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(FairyNoteTimelineItem)

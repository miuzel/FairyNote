import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button,  Timeline } from 'antd'
import { itemAdd, videoGotoEnd } from '../redux/actions';
import FairyNoteTimelineItem from './FairyNoteTimelineItem';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { i18nMsg } from '../constants'

const FairyNoteTimeline = ({timeline,itemAdd,videoGotoEnd,container}) => {
    let addpanel
    let isLive = document.getElementsByClassName("ytp-live").length > 0
    if (isLive) {
      addpanel = (
      <div>
       <Button style={{ marginRight: "10px" }} size="small" title="Ctrl/Command+Shift+A"
          shape="round" type="primary" id="addButton"
          icon="plus" onClick={()=>itemAdd()}>{i18nMsg("currentTime")}</Button>
        <Button size="small" 
          shape="round" type="primary" id="addButtonLatest"
          icon="plus" onClick={()=> {
            videoGotoEnd()
            itemAdd()
          }}>{i18nMsg("latestTime")}</Button>
      </div>)
    }else {
      addpanel = (
        <div>
          <Button style={{ marginRight: "10px" }} size="small" title="Ctrl/Command+Shift+A"
            shape="round" type="primary" id="addButton"
            icon="plus" onClick={()=>itemAdd()}>{i18nMsg("currentTime")}</Button>
        </div>
      )
    }
    return (
      <Timeline pending={addpanel}>
        <TransitionGroup>
          {
            timeline.items.map(
              (t, i) => (
            <CSSTransition
              key={t.id}
              timeout={{ enter: 500, exit: 450 }}
              classNames="content-card"
            >
               <FairyNoteTimelineItem
                index={i}
                container={container}
                {...t}/>
            </CSSTransition>
              )
            )
          }
          </TransitionGroup>
      </Timeline>
    )
}

FairyNoteTimeline.propTypes = {
    timeline: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  timeline: state.timeline
})

const mapDispatchToProps ={
    itemAdd ,
    videoGotoEnd,
}


export default connect(mapStateToProps, mapDispatchToProps)(FairyNoteTimeline)


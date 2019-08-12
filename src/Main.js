/* global chrome */

import React from 'react';
import {message, Modal, Button, Timeline, PageHeader,Popover } from 'antd';
import MyCard from './MyCard';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import "./content.css";
import Mousetrap from 'mousetrap';
import moment from 'moment';
const {confirm} = Modal;

export default class Main extends React.Component { 
  state = {
    timeLine: [],
    plainText: '',
    title: '',
    actors: [chrome.i18n.getMessage("host")],
    knownGuests: [],
      //  '江月', '小绵狼','醉酒小哥','Q大哥','农场小哥',
      // '掰白','卡车司机大哥','逗比小哥','KimC','居来提','西藏小哥'], //known guests
    modalvisible: false
    
  };
  toScroll = false;
  video = document.querySelector('#primary #player video.video-stream')
  isLive = document.getElementsByClassName("ytp-live").length
  document = null
  app = this.props.app
  initState = {
    timeLine: [],
    plainText: '',
    title: '',
    actors: [chrome.i18n.getMessage("host")],
    knownGuests: [],
      //  '江月', '小绵狼','醉酒小哥','Q大哥','农场小哥',
      // '掰白','卡车司机大哥','逗比小哥','KimC','居来提','西藏小哥'], //known guests
    modalvisible: false
  };
  handlemodalOk = e => {
    // do nothing
    this.handlemodalCancel(e);
  };
  toggle() {
    if(!this.app){
      return
    }
    if (this.app.style.display === "none") {
      this.app.style.display = "block";
    } else {
      this.app.style.display = "none";
    }

  }
  setToHost = () => {
    let pos = this.getActivePos()
    this.handleCardChange(pos,"actor",chrome.i18n.getMessage("host"))
  }
  handlemodalCancel = e => {
    this.setState({
      modalvisible: false,
    });
  };

  newCardCurrTime = () => {
    let ts = 0;
    if (this.video){
      ts = this.video.currentTime
    } 
    return {
      timestamp: ts,
      actor: '',
      comment: '',
      text: '',
      active: true
    }
  }
  appendTimeLineLatest = () => {
    this.jumpToLatest()
    this.appendTimeLine()
  }
  appendTimeLine = () => {
    const activeElem = this.document.activeElem
    if(activeElem && activeElem.blur){
      activeElem.blur();
    }
    var maxId = 0;
    let array = this.state.timeLine.slice();
    array = array.map((timeItem,i) => {
      array[i].active = false;
      let pattern = new RegExp(chrome.i18n.getMessage("guest")+"(\\d+)")
      let m = timeItem.actor.match(pattern)
      if (m){
        maxId = Math.max(m[1],maxId);
      };
      return timeItem;
    });
    let newGuest = `${chrome.i18n.getMessage("guest")}${maxId+1}`;
    let newCard = this.newCardCurrTime()
    newCard.actor = newGuest
    array = array.concat([newCard])
    this.setState(
      {
        timeLine: array
      }
    )
    array = this.sortArray(array)
    let actors = this.state.actors.slice()
    if (!actors.includes(newGuest)){
      actors.push(newGuest)
    }
    this.setState( {
      timeLine: array,
      actors: actors
    });
    this.toScroll = true;
  };

  handleCardInsert = (pos) => {
    let array = this.state.timeLine.slice()
    array = array.map((item) => { 
      item.active = false; 
      return item
    });
    let timestamp = this.state.timeLine[pos].timestamp - 0.001
    let newCard = {
      timestamp: timestamp < 0 ? 0:timestamp ,
      actor: '',
      comment:'',
      text: '',
      active: true
    };
    array.splice(pos,0,newCard);
    this.setState( {
      timeLine: array
    });
  };
  componentDidUpdate = () => {
    if (this.toScroll) {
      const addButton = document
        .querySelector("#my-extension-root iframe")
        .contentWindow
        .document
        .querySelector("#addButton");
      if (addButton) {
          addButton.scrollIntoView({ behavior: 'smooth' });
          //ta.select();
      } else {
        console.log("no add button found")
      }
      this.toScroll = false;
    }
  }

  handleCardDelete = (pos) => {
    let array = this.state.timeLine.slice()
    array.splice(pos,1);
    this.setState(
      {
        timeLine: array
      }
    );
  };
  
  sortArray = (input) => {
    let array = input.slice()
    array.sort((a,b) => a.timestamp-b.timestamp)
    let change = {}
    let index = 1;
    array = array.map((x,i) => {
      let guestPattern = new RegExp("^" + chrome.i18n.getMessage("guest") + "\\d+$")
      if (x.actor.match(guestPattern)){
        if(change[x.actor]){
          x.actor = change[x.actor]
        } else {
          let originActor = x.actor
          x.actor = chrome.i18n.getMessage("guest") + index
          index ++
          change[originActor] = x.actor
        }
      }
      return x
    })
    return array
  }
  
  cardSort = () => {
    var array = this.sortArray(this.state.timeLine)
    this.setState(
      {
        timeLine: array
      }
    );
  }

  handleCardChange = (pos,field,value) => {
    var array = this.state.timeLine.slice();
    array[pos][field] = value
    array = this.sortArray(array)
    this.setState(
      {
        timeLine: array
      }
    );
  };

  handleSave = () => {
    let key = this.getKey()
    if (key) {
      try {
        let file={}
        file[key]= this.state ;
        chrome.storage.sync.set(file, () => {
          message.success(chrome.i18n.getMessage("saveSuccess"));
        });
      } catch (err) {
        message.error(chrome.i18n.getMessage("sthWrong"))
      };
    } else {
      message.warning(chrome.i18n.getMessage("cannotFindVideoID"))
    }
  };
  doReset = () => {
    try {
      this.setState( this.initState )
      message.success(chrome.i18n.getMessage("resetSuccess"));
    
    } catch (err) {
      message.error(chrome.i18n.getMessage("sthWrong"))
    };
  };
  handleReset = () => {
    confirm({
      title: chrome.i18n.getMessage("confirmReset"),
      onOk: this.doReset
    } 
    )
  };
  getFullText = () => {
    let txt = "";
    this.state.timeLine.map( (item) => {
      let string = `${moment.utc(0).seconds(item.timestamp).format("HH:mm:ss")} ${item.actor}`
      if (item.comment.trim()){
        string = string +`(${item.comment})`
      }
      string = string + `: ${item.text}\n`;
      txt = txt + string;
      return item;
    });
    return txt;
  }
  generateFullText = () => {
    this.setState({
      plainText: this.getFullText(),
      modalvisible: true
    })
  };
  jumpToLatest = () => {
    // only work in Live stream
    if(this.isLive && this.video){
      this.video.currentTime = this.video.buffered.end(this.video.buffered.length-1)
    }
  }
  getActivePos = () => {
    let pos = -1
    this.state.timeLine.map((x,i) => {
      if(x.active){
        pos = i
      }
      return x
    })
    return pos
  }
  jumpToCurrent = () => {
    let pos = this.getActivePos()
    if (pos !== -1){
      this.handleNavigate(pos)
    }
  }
  handleNavigate = (pos) => {
    this.video.currentTime = this.state.timeLine[pos].timestamp
  }
  handleFocus = (pos) => {
    let array = this.state.timeLine.slice();
    array = array.map((x,i) => {
      if (i === pos){
        // if(x.active === false){
        //   this.video.currentTime = array[pos].timestamp
        // }
        x.active = true
      } else {
        x.active = false 
      }
      return x
    })
    this.setState({
      timeLine:array 
    })
  }
  getKey = () => {
    let key = ''
    let m = document.URL.match(/watch\?v=([^&]+)/);
    if (m){
       key = m[1]
    }
    return key 
  };
  loadSaved = () => {
    let key = this.getKey();
    let self = this;
    if (key) {
      chrome.storage.sync.get([key], function (result) {
        let savedState = result[key];
        if (!savedState || !savedState.timeLine) {
          savedState = self.initState;
        }
        self.setState(savedState);
        message.success(chrome.i18n.getMessage("loadSuccess"));
      });
    } else {
      message.warning(chrome.i18n.getMessage("pleaseGotoVideo"));
    }
  };
  // commands
  handleLoadSaved = () => {
    confirm({
      title: chrome.i18n.getMessage("confirmLoad"),
      onOk: this.loadSaved
    })
  }
  copyTextToClipboard = () => {
    let text = this.getFullText();
    //All credit goes to joelpt
    //Create a textbox field where we can insert text to. 
    var copyFrom = document.createElement("textarea");
    //Set the text content to be the text you wished to copy.
    copyFrom.textContent = text;
    //Append the textbox field into the body as a child. 
    //"execCommand()" only works when there exists selected text, and the text is inside 
    //document.body (meaning the text is part of a valid rendered HTML element).
    document.body.appendChild(copyFrom);
    //Select all the text!
    copyFrom.select();
    //Execute command
    document.execCommand('copy');
    //(Optional) De-select the text using blur(). 
    copyFrom.blur();
    //Remove the textbox field from the document.body, so no other JavaScript nor 
    //other elements can get access to this.
    document.body.removeChild(copyFrom);
    message.success(chrome.i18n.getMessage("copied"));
  }

  currCardTimeAdd(delta){
    let activePos = -1
    this.state.timeLine.map((x,i) => {
      if(x.active){
        // never active 2 cards.
        activePos = i
      }
      return x
    })
    if (activePos !== -1){
      const array = this.state.timeLine.slice()
      const newTime = array[activePos].timestamp + delta
      if(newTime >= 0 && newTime < this.video.duration){
        array[activePos].timestamp = newTime
        this.video.currentTime = newTime
        this.setState({
          timeLine: array
        })
      }
    }
    this.cardSort()
  }
  activeCardNumber(delta){
    let activePos = -1
    this.state.timeLine.map((x,i) => {
      if(x.active){
        // never active 2 cards.
        activePos = i
      }
      return x
    })
    if (activePos !== -1){
      const array = this.state.timeLine.slice()
      const newActive = activePos + delta
      if(newActive >= 0 && newActive < array.length){
        array[activePos].active = false;
        array[newActive].active = true;
        this.setState({
          timeLine: array
        })
        let ta = this.document.querySelector(".memo .ta" + newActive)
        if (ta) {
          ta.select()
          ta.scrollIntoView()
        } else {
          //hack here. somehow this document will move to the parent window.? need investigation
          let frame = this.document
            .querySelector("#my-extension-root iframe")
          if(frame){
            ta = frame
            .contentWindow
            .document
            .querySelector(".memo .ta" + newActive)
            if (ta) {
              ta.select()
              ta.scrollIntoView()
            }
          }
        }
      }
    }
  }
  duplicateCard(){
    this.state.timeLine.map((x,i) => {
      if(x.active){
        // never active 2 cards.
        this.handleCardInsert(i)
      }
      return x
    })
  }

  render = () => {
    let textStyle = {}
    if (chrome.i18n.getUILanguage() === 'en'){
      textStyle = {
        fontSize: "8px"
      }
    }
    return (
      <Frame head={[<link type="text/css" rel="stylesheet"  key='0'
        href={chrome.runtime.getURL("/static/css/content.css")} 
        ></link>]}
        contentDidMount={
          () => {
            console.log("Registering Shortcuts.")
            this.loadSaved();
            let bindkey = (key,fn,arg) => {
              let callback = e => fn.bind(this)(arg)
              if(this.document && this.document.body){
                Mousetrap(this.document.body).bind(key,callback.bind(this))
              }
            }
            // combinations mac
            bindkey('command+shift+right', this.currCardTimeAdd , 1)
            bindkey('command+shift+left' , this.currCardTimeAdd ,-1)
            bindkey('command+shift+up'   , this.activeCardNumber ,-1)
            bindkey('command+shift+down' , this.activeCardNumber , 1)
            bindkey('command+shift+k' , this.duplicateCard)
            bindkey('command+shift+s' , this.handleSave)
            bindkey('command+shift+f' , this.toggle)
            bindkey('command+shift+h' , this.setToHost)
            bindkey('command+shift+[' , this.jumpToCurrent)
            bindkey('command+shift+]' , this.jumpToLatest)
            //windows
            bindkey('ctrl+shift+right', this.currCardTimeAdd , 1)
            bindkey('ctrl+shift+left' , this.currCardTimeAdd ,-1)
            bindkey('ctrl+shift+up'   , this.activeCardNumber ,-1)
            bindkey('ctrl+shift+down' , this.activeCardNumber , 1)
            bindkey('ctrl+shift+k' , this.duplicateCard)
            bindkey('ctrl+shift+s' , this.handleSave)
            bindkey('ctrl+shift+f' , this.toggle)
            bindkey('ctrl+shift+h' , this.setToHost)
            bindkey('ctrl+shift+[' , this.jumpToCurrent)
            bindkey('ctrl+shift+]' , this.jumpToLatest)
          }
        }>
        <FrameContextConsumer key='0'>
          {
            // Callback is invoked with iframe's window and document instances
            ({ document, window }) => {
              // Render Children
              this.document = document
              let addpanel
              if (this.isLive) {
                addpanel = (
                <div>
                 <Button style={{ marginRight: "10px" }} size="small" title="Ctrl/Command+Shift+A"
                    shape="round" type="primary" id="addButton"
                    icon="plus" onClick={this.appendTimeLine}>{chrome.i18n.getMessage("currentTime")}</Button>
                  <Button size="small" title="Ctrl/Command+Shift+A"
                    shape="round" type="primary" id="addButtonLatest"
                    icon="plus" onClick={this.appendTimeLineLatest}>{chrome.i18n.getMessage("latestTime")}</Button>
                </div>)
              }else {
                addpanel = (
                  <div>
                    <Button style={{ marginRight: "10px" }} size="small" title="Ctrl/Command+Shift+A"
                      shape="round" type="primary" id="addButton"
                      icon="plus" onClick={this.appendTimeLine}>{chrome.i18n.getMessage("currentTime")}</Button>
                  </div>
                )
              }
              return <div id="extension"  key='0'>
                <div id="pageheader"  key='0'>
                  <PageHeader backIcon={false} title="FairyNote"
                    subTitle={<p>
                      <Button style={textStyle} size="small" type="link" id="genButton"
                        icon="copy" onClick={this.generateFullText}>{chrome.i18n.getMessage("output")}</Button>
                      <Button style={textStyle} size="small" type="link" id="saveButton"
                        icon="save" onClick={this.handleSave}>{chrome.i18n.getMessage("save")}</Button>
                      <Button style={textStyle} size="small" type="link" id="loadButton"
                        icon="reload" onClick={this.handleLoadSaved}>{chrome.i18n.getMessage("load")}</Button>
                      <Button style={textStyle} size="small" type="link" id="resetButton"
                        icon="delete" onClick={this.handleReset}>{chrome.i18n.getMessage("reset")}</Button>
                      <Popover style={textStyle} placement="bottomRight" title={chrome.i18n.getMessage("help")} content={
                        <div>
                          <p>Command/Ctrl + Shift + A     {chrome.i18n.getMessage("addOneLine")}</p>
                          <p>Command/Ctrl + Shift + C     {chrome.i18n.getMessage("copyOutput")}</p>
                          <p>Command/Ctrl + Shift + Up    {chrome.i18n.getMessage("upOneCard")}</p>
                          <p>Command/Ctrl + Shift + Down  {chrome.i18n.getMessage("downOneCard")}</p>
                          <p>Command/Ctrl + Shift + Right {chrome.i18n.getMessage("plusOneSecond")}</p>
                          <p>Command/Ctrl + Shift + Left  {chrome.i18n.getMessage("minusOneSecond")}</p>
                          <p>Command/Ctrl + Shift + S     {chrome.i18n.getMessage("save")}</p>
                          <p>Command/Ctrl + Shift + K     {chrome.i18n.getMessage("dupCard")}</p>
                          <p>Command/Ctrl + Shift + H     {chrome.i18n.getMessage("setHost")}</p>
                          <p>Command/Ctrl + Shift + [     {chrome.i18n.getMessage("navigate")}</p>
                          <p>Command/Ctrl + Shift + ]     {chrome.i18n.getMessage("latest")}</p>
                          <p>Command/Ctrl + Shift + F     {chrome.i18n.getMessage("toggle")} {chrome.i18n.getMessage("extensionName")} </p>
                        </div>
                      } 
                      getPopupContainer = {()=> document.body}
                      trigger="focus">
                      <Button style={textStyle} size="small" type="link" id="resetButton"
                        icon="question-circle">{chrome.i18n.getMessage("help")}</Button>
                      </Popover>
                    </p>} />
                </div>
                <div id="extensioncontent"  key='1'>
                  <Timeline pending={addpanel}>
                    {
                      this.state.timeLine.map(
                        (t, i) =>( <MyCard 
                          cardData={t} 
                          key={i}
                          cardIndex={i}
                          handleCardChange={this.handleCardChange.bind(this,i)}
                          handleCardDelete={this.handleCardDelete.bind(this,i)}
                          handleCardInsert={this.handleCardInsert.bind(this,i)}
                          handleNavigate={this.handleNavigate.bind(this,i)}
                          handleTimeChange={this.cardSort.bind(this)}
                          handleFocus={this.handleFocus.bind(this,i)}
                          actors = {this.state.actors}
                          knownGuests = {this.state.knownGuests}
                          // highlight the active card , avoid confusion when re-sort cards.
                          active = {t.active}
                          container={document.body}
                          />
                        )
                      )
                    }
                  </Timeline>
                </div>

                <Modal key='2'
                  style={
                    {left:"50px"}
                  }
                  width="900px"
                  title={<div>
                    <span>{chrome.i18n.getMessage("outputText")}</span>
                    <Button type="link" id="copyButton" style={{marginLeft: "10px"}}
                        icon="copy" onClick={this.copyTextToClipboard}>{chrome.i18n.getMessage("copyOutput")}</Button>
                    <span>(Ctrl/Command+Shift+Z {chrome.i18n.getMessage("copyAnyTime")})</span>
                  </div>
                  }
                  visible={this.state.modalvisible}
                  onOk={this.handlemodalOk}
                  onCancel={this.handlemodalCancel}
                >
                  <pre id="#generated">{this.state.plainText}</pre>
                </Modal>
              </div>
            }
          }
        </FrameContextConsumer>
      </Frame>
    )
  };
}
/* global chrome */
/* src/content.js */
import i18n from '../../_locales/i18n'
import {LoadLocales} from '../../_locales/i18n'
import ReactDOM from 'react-dom'
import React from 'react'
import FairyNote from '../../containers/FairyNote'
import FairyNoteMarkups from '../../containers/FairyNote/FairyNoteMarkups'
import Mousetrap from 'mousetrap'
import 'mousetrap-global-bind'
import { Spin } from 'antd'
import './content.styles.css'
import LZString from 'lz-string'
import Frame , {FrameContextConsumer} from 'react-frame-component';
let initialized = false;
LoadLocales(()=>{
  console.log("Loading FairyNote Extension.")
  const app = document.createElement('div')
  app.id = "fairynote-two-root";

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log(`Received msg ${request.message}`)
      if (request.message === "clicked_page_action") {
        init(()=>{
          toggle(app)
        });
      }
      if (request.message === "url_change") {
        if(initialized){
          console.log("url change triggered. rerender.")
          initialized = false
          let show = app.classList.contains("show")
          init(()=>{
            if(!show){
              toggle(app)
            }
          });
        }
      }
    }
  );

  function toggle(app) {
    if(!initialized){
      console.log("toggle app not initialized")
      return
    }
    console.log("toggle app")
    if (app.classList.contains("show")) {
      app.classList.remove("show")
    } else {
      app.classList.remove("hide")
      app.classList.add("show")
    }
    setTimeout(() => {
      if (!app.classList.contains("show")) {
        app.classList.add("hide")
      }
    }, 250)
  }

  function init(onfinish) {
    if (!initialized) {
      console.log("initializing")
      Mousetrap.unbind('ctrl+shift+g')
      Mousetrap.unbind('command+shift+g')
      const loading = document.createElement('div')
      loading.id = "fairynote-two-loading"
      loading.classList.add("show")
      app.appendChild(loading)

      ReactDOM.render((
        <div id="fairynote-two-loading-spin">
          <Spin size="large" tip="LOADING...">
          </Spin>
        </div>
      ), loading);
      var appFrame = document.querySelector("#fairynote-two-frame")
      if( appFrame ){
        appFrame.remove()
      }
      var markups = document.querySelector("#fairynote-two-markups")
      if( markups ){
        markups.remove()
      }
      appFrame = document.createElement('div');
      appFrame.id = "fairynote-two-frame";

      appFrame.style.visibility="hidden"
      function hideandDelete(element, timeout) {
        appFrame.style.visibility="visible"
        element.classList.remove("show")
        setTimeout(() => element.remove(), timeout)
      }

      markups = document.createElement('div');
      markups.id = "fairynote-two-markups";
      app.appendChild(appFrame);
      document.body.appendChild(app);
      // chrome.storage.onChanged.addListener(function(changes, namespace) {
      //   for (var key in changes) {
      //     var storageChange = changes[key];
      //     console.log('Storage key "%s" in namespace "%s" changed. ' +
      //                 'Old value was "%s", new value is "%s".',
      //                 key,
      //                 namespace,
      //                 storageChange.oldValue,
      //                 storageChange.newValue);
      //   }
      // });


      class Main extends React.Component {
        render() {
            return (
                <Frame key="appframe" head={[<link   key="link1" type="text/css" rel="stylesheet" href={chrome.runtime.getURL("./content.styles.css")} ></link>,
                <link onLoad={() => {
                  hideandDelete(loading, 20)
                }} key="link2" type="text/css" rel="stylesheet" href={chrome.runtime.getURL("./antd.min.css")} ></link>,
                <link  key="link3" type="text/css" rel="stylesheet" href={chrome.runtime.getURL("./fairynote.css")} ></link>]}> 
                   <FrameContextConsumer key="appframec">
                   {
                      ({document, window}) => {
                        return <FairyNote key="FairyNote" chrome={chrome} app={document.body} toggle={toggle.bind(null, app)}
                        // onLoad={() => {
                        //   hideandDelete(loading, 300)
                        // }} 
                        />
                      }
                    }
                    </FrameContextConsumer>
                </Frame>
            )
        }
     }
    
      const key = "FairyNote#Settings"
      chrome.storage.sync.get(key, function (result) {
        if (result) {
          let savedState = result[key];
          if(savedState){
            i18n.changeLanguage(savedState.language)
          }
          let migrating = {}
          let keys = []
          // find all synced data
          for (let k in result){
            if(k !== key){
              console.log("migrate data "+k)
              keys.push(k)
              // compress 
              migrating[k] =  LZString.compressToUTF16(JSON.stringify(result[k]))
            }
          }
          // save synced data to local
          if (migrating !== {}){
            chrome.storage.local.set(migrating,()=>{console.log("compressed data saved.")})
          }
          // remove the synced keys
          if(keys){
            chrome.storage.sync.remove(keys, ()=>{console.log("removed synced keys")})
          }
        }
        ReactDOM.render(
          <Main  />
        , appFrame);
        //load progress bar markup. Only support youtube by now.
        const markupContainer = document.querySelector(".ytp-chrome-bottom") 
        if (markupContainer) { 
          markupContainer.appendChild(markups); 
          ReactDOM.render(<FairyNoteMarkups />, markups);
        }
        initialized = true
        console.log("initialized")
        if(onfinish){
          onfinish()
        }
      })
    } else {
      if(onfinish){
        onfinish()
      }
    }
  }

  Mousetrap.bindGlobal('ctrl+shift+g', function(e) {
    
    init(()=>{
      toggle(app)
    })
  });

  Mousetrap.bindGlobal('command+shift+g', function(e) {
    
    init(()=>{
      toggle(app)
    })
  });
  console.log('FairyNote initiated.')
})
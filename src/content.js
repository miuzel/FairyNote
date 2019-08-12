/*global chrome*/
/* src/content.js */
import ReactDOM from 'react-dom'
import React from 'react'
import FairyNote from './components/FairyNote'
import Mousetrap from 'mousetrap'
import 'mousetrap-global-bind'
import { i18nMsg } from './constants'
import { Spin ,message} from 'antd'
import './index.css'

let initialized = false;

console.log("Loading XS extension.")
const app = document.createElement('div')
app.id = "my-extension-root";

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(`Received msg ${request.message}`)
    if (request.message === "clicked_page_action") {
      init();
      toggle(app)
    }
  }
);

function toggle(app) {
  if(!initialized){
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

function hideandDelete(element, timeout) {
  element.classList.remove("show")
  setTimeout(() => element.remove(), timeout)
}

function init() {
  if (!initialized) {
    let videoPlayer = document.querySelector('#primary #player video.video-stream')
    if(!videoPlayer || 
      ! (
         document.URL.match(/youtube\.com\/watch\?v=.+/) ||
         document.URL.match(/localhost/)  // test env
        )
      ){
      message.warn(i18nMsg("cannotFindVideoID"))
    return
    }
    console.log("initializing")
    Mousetrap.unbind('ctrl+shift+f')
    Mousetrap.unbind('command+shift+f')
    const loading = document.createElement('div');
    loading.id = "my-extension-loading";
    loading.classList.add("show");
    app.appendChild(loading);
    const appFrame = document.createElement('div');
    appFrame.id = "my-extension-frame";
    app.appendChild(appFrame);
    ReactDOM.render((
      <div id="my-extension-loading-spin">
        <Spin size="large" tip={i18nMsg("loading")}>
        </Spin></div>
    ), loading);
    document.body.appendChild(app);
    ReactDOM.render(<FairyNote app={appFrame} toggle={toggle.bind(null, app)}
      onLoad={() => hideandDelete(loading, 300)} />, appFrame);
    initialized = true
    console.log("initialized")
  }
}

Mousetrap.bindGlobal('ctrl+shift+f', function(e) {
  init()
  toggle(app)
});
Mousetrap.bindGlobal('command+shift+f', function(e) {
  init()
  toggle(app)
});

export { init };
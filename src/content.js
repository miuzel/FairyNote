/*global chrome*/
/* src/content.js */
import ReactDOM from 'react-dom';
import React from 'react';
import Main from './Main'
import {message} from 'antd';
import Mousetrap from 'mousetrap'

let initialized = false;
console.log("Loading XS extension.")
const app = document.createElement('div');
app.id = "my-extension-root";
app.style.display = "none";

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(`Received msg ${request.message}`);
    if (request.message === "clicked_page_action") {
      toggle();
    }
  }
);

window.onload  = () => {
  message.info(chrome.i18n.getMessage("extensionReady")) 
}

Mousetrap.bind('ctrl+shift+f', function(e) {
  toggle();
});
Mousetrap.bind('command+shift+f', function(e) {
  toggle();
});

function toggle() {
  if (app.style.display === "none") {
    if (!initialized) {
      initialized = true;
      document.body.appendChild(app);
      const main = ReactDOM.render( < Main app={app} /> , app);

       // combinations mac
      Mousetrap.bind('command+shift+right', function(e) {
        main.currCardTimeAdd(1);
      });
      Mousetrap.bind('command+shift+left', function(e) {
        main.currCardTimeAdd(-1);
      });
      Mousetrap.bind('command+shift+up', function(e) {
        main.currCardTimeAdd(1);
      });
      Mousetrap.bind('command+shift+down', function(e) {
        main.activeCardNumber(-1);
      });
      Mousetrap.bind('command+shift+k', function(e) {
        main.duplicateCard();
      });
      Mousetrap.bind('command+shift+s', function(e) {
        main.handleSave();
      });
      //windows
      Mousetrap.bind('ctrl+shift+right', function(e) {
        main.currCardTimeAdd(1);
      });
      Mousetrap.bind('ctrl+shift+left', function(e) {
        main.currCardTimeAdd(-1);
      });
      Mousetrap.bind('ctrl+shift+up', function(e) {
        main.activeCardNumber(-1);
      });
      Mousetrap.bind('ctrl+shift+down', function(e) {
        main.activeCardNumber(1);
      });
      Mousetrap.bind('ctrl+shift+k', function(e) {
        main.duplicateCard();
      });
      Mousetrap.bind('ctrl+shift+s', function(e) {
        main.handleSave();
      });
      Mousetrap.bind('ctrl+shift+h', function(e) {
        main.jumpToCurrent();
      });
      Mousetrap.bind('ctrl+shift+[', function(e) {
        main.jumpToCurrent();
      });
      Mousetrap.bind('ctrl+shift+]', function(e) {
        main.jumpToLatest();
      });
      chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
          if (request.message === "newLine") {
            const addButton = document
              .querySelector("#my-extension-root iframe")
              .contentWindow
              .document
              .querySelector("#addButton");
            if(addButton.click){
              addButton.click();
            }
          }
          if (request.message === "copyText") {
            main.copyTextToClipboard();
          }
        }
      );
    }
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}

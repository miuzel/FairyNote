/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import registerServiceWorker from './registerServiceWorker';
import Mousetrap from 'mousetrap'
import message from './_locales/en/messages.json'
class ChromeMock {
    constructor(){
        this.i18n = {
          getMessage: (key) =>  (message[key] && message[key].message) ? message[key].message : "undefined",
          getUILanguage: ()=> 'en'
        }
        this.runtime = {
            getURL: (value) => {
                return value
            },
            onMessage: {
                addListener: (params) => {
                    
                }
            }            
        }
        this.storage = {
            sync: {
                set: (file,fn) => {
                    this.storage.data[file.key] = file[file.key]
                    fn()
                },
                get: (key,fn) => {
                    fn(this.storage.data[key[0]])
                }
            }
        }
    }
}

chrome = new ChromeMock();

let main = ReactDOM.render(<Main />, document.getElementById('my-extension-root'));
// combinations mac
Mousetrap.bind('command+shift+right', function(e) {
  main.currCardTimeAdd(1);
});
Mousetrap.bind('command+shift+left', function(e) {
  main.currCardTimeAdd(-1);
});
Mousetrap.bind('command+shift+up', function(e) {
  main.activeCardNumber(-1);
});
Mousetrap.bind('command+shift+down', function(e) {
  main.activeCardNumber(1);
});
Mousetrap.bind('command+shift+d', function(e) {
  main.duplicateCard();
});
Mousetrap.bind('command+shift+s', function(e) {
  main.handleSave();
});
Mousetrap.bind('command+shift+a', function(e) {
  main.appendTimeLine();
});
Mousetrap.bind('command+shift+z', function(e) {
  main.generateFullText();
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
Mousetrap.bind('ctrl+shift+d', function(e) {
  main.duplicateCard();
});
Mousetrap.bind('ctrl+shift+s', function(e) {
  main.handleSave();
});
Mousetrap.bind('ctrl+shift+a', function(e) {
  main.appendTimeLine();
});
Mousetrap.bind('ctrl+shift+z', function(e) {
  main.generateFullText();
});
registerServiceWorker();

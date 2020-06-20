/* global chrome */
import message from './_locales/zh_CN/messages.json'
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
            data: {},
            sync: {
                set: (file,fn) => {
                    console.log("save call")
                    for(let k in file){
                        this.storage.data[k] = file[k]
                    }
                    fn()
                },
                get: (keys,fn) => {
                    console.log("read call")
                    let res = {}
                    for(let k of keys){
                        if(this.storage.data[k]){
                            res[k] = this.storage.data[k]
                        }
                    }
                    fn(res)
                },
                remove: (keys,fn) => {
                    fn()
                }
            },
            local: {
                set: (file,fn) => {
                    console.log("save call")
                    for(let k in file){
                        this.storage.data[k] = file[k]
                    }
                    fn()
                }
            }
        }
    }
  }
  chrome = new ChromeMock();
  export default chrome
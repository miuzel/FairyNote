import React from 'react'
import { connect } from 'react-redux'
import Mousetrap from 'mousetrap'
import 'mousetrap-global-bind'
import { textCopy, itemAdd, itemFocus, itemUpdate, itemCopy,  timelineSave, videoGoto, videoGotoEnd, itemDel,itemBlur } from '../redux/actions';


export const bindShortcuts = (props) => {
    console.log("Registering keyboard shortcuts.")
    let bindkey = (key, fn) => {
        let keysToBind = [""]
        let keys = key.toLowerCase().split("+").map(x => x.trim())
        for (let k of keys) {
            let array = []
            for (let l of k.split("/")) {
                array = array.concat(keysToBind.map(x => x + "+" + l))
            }
            keysToBind = array
        }
        keysToBind = keysToBind.map(x => x.substring(1))
        keysToBind.map(k => {
            Mousetrap.unbind(k)
            Mousetrap.bindGlobal(k, (e) => {
                if (e.preventDefault) {
                    e.preventDefault()
                } 
                fn()
            })
            console.log(k + " binded.")
            return k
        })
    }
    let shortcuts = getShortcuts(props)

    for (let shortcut of shortcuts) {
        bindkey(shortcut.key, shortcut.action)
    }
    console.log("Keyboard shortcuts registered")
}

const FairyNoteShortcuts = (props) => {
    bindShortcuts(props)
    return (
        <div style={{ height: "0px" }}>
        </div>
    )
}

const getShortcuts = ({
    videoGoto,
    videoGotoEnd,
    textCopy,
    timelineSave,
    itemAdd,
    itemFocus,
    itemUpdate,
    itemCopy,
    itemBlur,
    itemDel,
    toggle}) => [
        {
            name: "addOneLine",
            key: "Command/Ctrl + Shift + A",
            action: () => itemAdd()
        },
        {
            name: "copyOutput",
            key: "Command/Ctrl + Shift + Z",
            action: () => textCopy()
        },
        {
            name: "upOneCard",
            key: "Command/Ctrl + Shift + Up",
            action: () => itemFocus({ delta: -1 })
        },
        {
            name: "downOneCard",
            key: "Command/Ctrl + Shift + Down",
            action: () => itemFocus({ delta: 1 })
        },
        {
            name: "plusOneSecond",
            key: "Command/Ctrl + Shift + Right",
            action: () => itemUpdate({ deltaTime: 1 })
        },
        {
            name: "minusOneSecond",
            key: "Command/Ctrl + Shift + Left",
            action: () => itemUpdate({ deltaTime: -1 })
        },
        {
            name: "plusLatency",
            key: "Command/Ctrl + Shift + .",
            action: () => itemUpdate({ deltaTimeLatency: 1 })
        },
        {
            name: "minusLatency",
            key: "Command/Ctrl + Shift + ,",
            action: () => itemUpdate({ deltaTimeLatency: -1 })
        },
        {
            name: "save",
            key: "Command/Ctrl + Shift + S",
            action: () => timelineSave()
        },
        {
            name: "dupCard",
            key: "Command/Ctrl + Shift + K",
            action: () => itemCopy()
        },
        {
            name: "delete",
            key: "Command/Ctrl + Shift + X",
            action: () => {
                itemBlur()
                itemDel()
            }
        },
        {
            name: "setHost",
            key: "Command/Ctrl + Shift + H",
            action: () => itemUpdate({ shiftActor: +1 })
        },
        {
            name: "navigate",
            key: "Command/Ctrl + Shift + [",
            action: () => videoGoto()
        },
        {
            name: "latest",
            key: "Command/Ctrl + Shift + ]",
            action: () => videoGotoEnd()
        },
        {
            name: "toggle",
            key: "Command/Ctrl + Shift + G",
            action: (e) => toggle()
        }
    ]


const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
    textCopy, itemAdd, itemFocus, itemUpdate, itemCopy,  timelineSave, videoGoto, videoGotoEnd, itemDel, itemBlur
}

export const shortcuts = getShortcuts(mapDispatchToProps)

export default connect(mapStateToProps, mapDispatchToProps)(FairyNoteShortcuts)

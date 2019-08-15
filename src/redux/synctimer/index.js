import { message } from 'antd';
import moment from 'moment';
import { i18nMsg } from '../../constants';
const declaration = 'INCOGRESJULY4176TheunaimosDclrtfdAWvbypwgqkHMjFPzxBK'
var syncTimer 
export const encodeWithDeclaration = (number) => {
    let str = number > 0 ? "" : "8"
    let num = number > 0 ? Math.floor(number) : Math.floor(-number)
    let i = num % 52
    while (num > 0){
        str += declaration[i]
        num = Math.floor(num / 52)
        i = num % 52
    }
    return str
}

export const startRevealMagicWord = () => {
    if(!syncTimer){
        message.info(`FairyNote ${i18nMsg("magicword")}: `+ genMagicWord())
        syncTimer = setInterval(()=>{
            message.info(`FairyNote ${i18nMsg("magicword")}: `+ genMagicWord(), 15)
        },300000)
    }
}
export const stopRevealMagicWord = () => {
    if(syncTimer){
        clearInterval(syncTimer)
        syncTimer = false
    }
}

export const decodeWithDeclaration = (str) => {
    let sign = 1
    let num = 0
    let ord = 1
    if (!str){
        return 0
    }
    if (str[0] === "8") {
        sign = -1 
        str = str.substr(1)
    }
    str.split("").map(x => {
        num += declaration.indexOf(x)*ord
        console.log(ord)
        console.log(declaration.indexOf(x))
        console.log(num)
        ord *= 52
        return x
    })
    return num*sign
}

export const genMagicWord = () => {
    let video = document.querySelector('#primary #player video.video-stream')
    if (video) {
        const anchor = 1591200000000
        let now = moment() - 0
        let start = now - video.currentTime * 1000
        let value = anchor - start
        return encodeWithDeclaration(value)
    }
}
export const getVideoTimeFromMagicWord = (magicWord) => {
    const anchor = 1591200000000
    let value = decodeWithDeclaration(magicWord)
    let start = anchor - value
    let now = moment() - 0
    let videoTime = (now - start)/1000
    return videoTime > 0 ? videoTime : 0
}

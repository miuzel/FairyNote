import moment from 'moment'
import { message } from 'antd';
import { i18nMsg } from './constants'


export const copyTextToClipboard = (text) => {
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
    message.success(i18nMsg("copied"));
}

export const getCensoredText = (text, censoredWords) => {
    var result = text
    if (censoredWords) {
        for (var w of censoredWords) {
            var re = new RegExp(w, 'gi')
            result = result.replace(re, (match) => {
                const delimiters = ['|', '.', ',', '`', '_', '‚', 'ˆ', '•', '¦', '°', '·', '„']
                var delimiter = delimiters[Math.floor(Math.random() * 11)].repeat(Math.floor(Math.random() * 2) + 1)
                return `${match.split("").join(delimiter)}`
            })
        }
    }
    return result
}
export const getFullText = (items) => {
    let txt = "";
    items.map((item) => {
        let string = `${moment.utc(0).seconds(item.timestamp ? item.timestamp : 0).format("HH:mm:ss")} - `
        let actor = item.actor
        if (item.comment && item.comment.trim()) {
            actor = actor + `(${item.comment})`
        }
        if(actor){
            string = string + actor
            if(item.text){
                string = string + ": "
            }
        }
        string = string + `${item.text}\n`;
        txt = txt + string;
        return item;
    });
    if (txt.substring(0,8) !== "00:00:00") {
        txt = "00:00:00 - " + i18nMsg("addFirstChapter") + "\n" + txt
    }
    txt = txt ? txt + "\n" + i18nMsg("generatedByFairyNote") : ""
    return txt;
}

export const getVideoId = () => {
    let key = ''
    let m = document.URL.match(/watch\?v=([^&]+)/);
    if (m) {
        key = m[1]
    }
    return key
};
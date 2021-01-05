import moment from 'moment'
import { message } from 'antd';
import i18n from './_locales/i18n';

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
    message.success(i18n.t("copied"));
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
const scenePattern = new RegExp("(.+)(\\d+)","g")
let translate_actor = (actor) => {
  let actorshow = i18n.t(actor)
  let m = actor.match(scenePattern)
  let translate = y => {
      let m1 = y.match("(.+)(\\d+)")
      actorshow = i18n.t(m1[1])+m1[2]
      return y
  }
  if (m) {
      m.map(translate)
  }
  return actorshow
}


export const getFullText = (items) => {
    let txt = "";
    items.map((item) => {
        let string = `${moment.utc(0).seconds(item.timestamp ? item.timestamp : 0).format("HH:mm:ss")} - `
        let actor = translate_actor(item.actor)
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
        txt = "00:00:00 - " + i18n.t("addFirstChapter") + "\n" + txt
    }
    txt = txt ? txt + "\n" + i18n.t("generatedByFairyNote") : ""
    return txt;
}

export const getVideoId = () => {
    // Youtube Pattern https://www.youtube.com/watch?v=zQyUhaLq4DM
    let match = document.URL.match(/www.youtube.com\/watch\?(.*&)*v=([^&]+)/);
    if (match){
       return match[2]
    } 
    // Bilibili Pattern https://www.bilibili.com/video/BV1Jf4y1y7wQ?...
    match = document.URL.match(/bilibili.com\/video\/([^?]+)/);
    if (match){
        return "BILIBILI?"+match[1] 
    }
    // Odysee Pattern https://odysee.com/@SpiritScience:1/spirit-science-53-the-hero-s-journey:b
    match = document.URL.match(/odysee.com\/([^?]+)/);
    if (match){
        return "ODYSEE?"+match[1]
    }
    // LBRY Pattern  https://lbry.tv/@SpiritScience:1/spirit-science-53-the-hero-s-journey:b
    match = document.URL.match(/lbry.tv\/([^?]+)/);
    if (match){
        return "ODYSEE?"+match[1] //same as odysee(all lbry protocol)
    }
    return 'localdata' 
};
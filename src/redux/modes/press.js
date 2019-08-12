import {sortArray,getMaxSpeaker} from './utils'
import { i18nMsg } from '../../constants'

export const getDefaultCandidates = () => {
    return [i18nMsg("spokesman")]
}

export const getNewSpeaker = (timelineitems) => {
    if(timelineitems.length === 0){
        return getMaxSpeaker(timelineitems,i18nMsg("question"))
    }

    if(timelineitems.length && timelineitems[timelineitems.length-1].actor === i18nMsg("spokesman") ){
        return getMaxSpeaker(timelineitems,i18nMsg("question"))
    } else {
        return i18nMsg("spokesman")
    }
}

export const rearrangeTimeline = (timelineitems) => {
    return sortArray(timelineitems,i18nMsg("question"))
}

export default {
    getNewSpeaker,getDefaultCandidates,rearrangeTimeline
}
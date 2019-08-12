import {sortArray} from './utils'
import { i18nMsg } from '../../constants'

export const getDefaultCandidates = () => {
    return [i18nMsg("host")]
}

export const getNewSpeaker = (timelineitems) => {
    if(timelineitems && timelineitems.length > 0){
        return timelineitems[timelineitems.length-1].actor
    } else {
        return ""
    }
    
}

export const rearrangeTimeline = (timelineitems) => {
    return sortArray(timelineitems,i18nMsg("journalist"))
}

export default {
    getNewSpeaker,getDefaultCandidates,rearrangeTimeline
}
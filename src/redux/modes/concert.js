import {sortArray,getMaxSpeaker} from './utils'
import { i18nMsg } from '../../constants'

export const getDefaultCandidates = () => {
    return [i18nMsg("host")]
}

export const getNewSpeaker = (timelineitems) => {
    return getMaxSpeaker(timelineitems,i18nMsg("track"))
}

export const rearrangeTimeline = (timelineitems) => {
    return sortArray(timelineitems,i18nMsg("track"))
}

export default {
    getNewSpeaker,getDefaultCandidates,rearrangeTimeline
}
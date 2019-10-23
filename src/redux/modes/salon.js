import {modeSequentialCreator} from './utils'
export default {
    ...modeSequentialCreator(["host"],"journalist"),
    getNewSpeaker: (timelineitems) => ""
}
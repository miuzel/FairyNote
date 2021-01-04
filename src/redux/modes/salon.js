import {modeSequentialCreator} from './homodes'
const salon = {
    ...modeSequentialCreator(["host"],"journalist"),
    getNewSpeaker: (timelineitems) => ""
}
export default salon 
/* global chrome */
import * as types from '../actions/types'
import { message } from 'antd';
import { modes } from '../modes';
import uuidv4 from 'uuid/v4';
import { getCensoredText, getFullText, copyTextToClipboard, getVideoId } from '../../utils'
import { i18nMsg } from '../../constants'
import csvstringify from 'csv-stringify'
import csvparse from 'csv-parse/lib/sync'
import moment from 'moment'
import subsrt from 'subsrt'
import LZString from 'lz-string'

const initialState = []

const getVideo = () => document.querySelector('video')

export default (state = initialState, { type, payload }) => {
    let nextState = { ...state }
    let videoElement = getVideo()
    switch (type) {
        case types.MODE_UPDATE:
            nextState.mode = payload.mode
            return nextState

        case types.VIDEO_GOTO:
            if (videoElement) {
                if(payload && payload.goto !== undefined){
                    videoElement.currentTime = payload.goto
                } else{
                    let activeItem = state.items.find(x => x.active)
                    if(activeItem) {
                        videoElement.currentTime = activeItem.timestamp
                    }
                }
            }
            return state

        case types.VIDEO_GOTO_END:
            if (videoElement) {
                videoElement.currentTime =videoElement.buffered.end(videoElement.buffered.length - 1)
            }
            return state

        case types.ITEM_ADD:
            nextState.items = nextState.items.map(x => ({ ...x, active: false }))
            nextState.items = nextState.items.concat([{
                timestamp: videoElement.currentTime,
                actor: modes[state.mode].getNewSpeaker(nextState.items),
                comment: '',
                text: '',
                id: uuidv4(),
                active: true
            }])
            nextState.items = modes[state.mode].rearrangeTimeline(nextState.items)
            nextState.changed = true
            return nextState

        case types.ITEM_COPY:
            let oldItemIndex
            if (payload  && payload.index !== undefined) {
                oldItemIndex = payload.index
            } else {
                oldItemIndex = nextState.items.findIndex(x => x.active)
            }
            if (oldItemIndex < 0 || oldItemIndex >= nextState.items.length) {
                return nextState
            }
            let newItem = 
            {
                timestamp: state.items[oldItemIndex].timestamp-0.01,
                actor: modes[state.mode].getNewSpeaker(nextState.items),
                comment: '',
                text: '',
                id: uuidv4(),
                active: true
            }
            nextState.items.splice(oldItemIndex, 0, newItem)
            nextState.items = modes[state.mode].rearrangeTimeline(nextState.items)
            nextState.changed = true
            return nextState

        case types.ITEM_DEL:
            if(payload && payload.index !== undefined){
                nextState.items.splice(payload.index, 1)
            } else {
                let activeIndex = nextState.items.findIndex(x=> x.active)
                if (activeIndex !== -1){
                    nextState.items.splice(activeIndex, 1)
                    if (nextState.items[activeIndex]){
                        nextState.items[activeIndex].active =true
                    } else {
                        activeIndex -= 1
                        if(nextState.items[activeIndex]){
                        nextState.items[activeIndex].active =true
                        }
                    }
                }
            }
            nextState.items = modes[state.mode].rearrangeTimeline(nextState.items)
            nextState.changed = true
            return nextState

        case types.ITEM_FOCUS:
            let newFocused = state.items.findIndex(x => x.active)
            if (payload.delta) {
                newFocused = newFocused + payload.delta
            }
            if (payload.index !== undefined) {
                newFocused = payload.index
            }
            if (newFocused >= 0 && newFocused < state.items.length) {
                nextState.items = nextState.items.map((x, i) => (
                    { ...x, active: i === newFocused ? true : false }))
            }
            if (payload.settings.autoNavigating){
                videoElement.currentTime = nextState.items[newFocused].timestamp
            }
            return nextState

        case types.ITEM_UPDATE:
            let updateIndex = -1
            newItem = {}
            if (payload.index !== undefined) {
                updateIndex = payload.index
            } else {
                updateIndex = state.items.findIndex(x => x.active)
            }
            if (updateIndex === -1) {
                return state
            }
            if (payload.item) {
                newItem = {...state.items[updateIndex], ...payload.item}
            } else {
                if (payload.deltaTimeLatency !== undefined) {
                    nextState.items = state.items.map((x,i)=>{
                        if(i >= updateIndex){
                            x.timestamp += payload.deltaTimeLatency
                        }
                        return x
                    } )
                    newItem = state.items[updateIndex]
                    videoElement.currentTime = newItem.timestamp
                    nextState.changed = true
                    return nextState
                }
                if (payload.deltaTime !== undefined) {
                    newItem = state.items[updateIndex]
                    newItem.timestamp += payload.deltaTime
                    videoElement.currentTime = newItem.timestamp
                }
                if (payload.newActor !== undefined) {
                    newItem = state.items[updateIndex]
                    newItem.actor = payload.newActor 
                }
                if (payload.shiftActor !== undefined) {
                    let actors = payload.data.actors
                    let recalls = state.items.map(x=>x.actor)
                    let candidates = [...new Set( [...actors,
                        ...modes[state.mode].getDefaultCandidates()])]
                    let newActor = modes[state.mode].getNewSpeaker(state.items.slice(0,updateIndex))
                    if( -1 === candidates.indexOf(newActor)){
                        candidates = [...new Set([...candidates, ...recalls.concat([newActor]).sort()])]
                    } else {
                        candidates = [...new Set([...candidates, ...recalls])]
                    }
                    newItem = state.items[updateIndex]
                    let currCandidateIndex = candidates.indexOf(newItem.actor)
                    if (-1 !== currCandidateIndex){
                        newItem.actor = candidates[(currCandidateIndex+payload.shiftActor) % candidates.length]
                    } else {
                        newItem.actor = candidates[0]
                    }
                    nextState.items[updateIndex] = newItem
                    nextState.changed = true
                    return nextState
                }
            }
            nextState.items[updateIndex] = newItem
            nextState.items = modes[state.mode].rearrangeTimeline(nextState.items)
            nextState.changed = true
            return nextState

        case types.TIMELINE_LOAD:
            return { ...nextState, ...payload }

        case types.TIMELINE_RESET:
            nextState.items = []
            return nextState

        case types.TEXT_COPY:
            let text = getFullText(state.items)
            if (payload.settings.censorWordEnabled) {
                text = getCensoredText(text,payload.settings.censoredWords)
            }
            copyTextToClipboard(text)
            return state

        case types.TIMELINE_SAVE:
            if(nextState.changed){
                saveState(state,payload ? payload.quiet : false)
                nextState.changed = false
            }
            return nextState
        case types.TIMELINE_EXPORT:

            csvstringify(state.items.map(
                x => [moment.utc(0).seconds(x.timestamp).format("HH:mm:ss"),
                x.actor,
                x.comment,
                x.text]
            ), (_, output) => {
                let link = document.createElement("a");
                link.download = "content_"+ getVideoId() +".csv";
                link.href = "data:text/csv," + encodeURIComponent(output)
                link.click()
            })
            return state
        case types.TIMELINE_EXPORT_SRT:
            //Build the srt content
            var options = { format: 'srt' };

            var content = subsrt.build(state.items.map((x,i) => {
                var text = ""
                if (x.actor){
                    text = x.actor
                }
                if (x.comment.trim()) {
                    text = text + `(${x.comment})`
                }
                text = text + (text !== "" ? ":" : "") + x.text;
                return {
                    start: x.timestamp * 1000, 
                    end: (i+1) === state.items.length ? getVideo().currentTime * 1000 : state.items[i+1].timestamp * 1000 ,
                    text}
                }), options)
            let link = document.createElement("a");
            link.download = "content_"+ getVideoId() +".srt";
            link.href = "data:text/srt," + encodeURIComponent(content)
            link.click()
            return state 

        case types.TIMELINE_IMPORT:
            nextState.items = csv2items(payload.csvdata)
            return nextState

        default:
            return state
    }
}


const csv2items = csv => {
    const records = csvparse(csv, {
    columns: false,
    skip_empty_lines: true
    })
    return records.map(x => ( {
            timestamp: (moment(x[0],"HH:mm:ss") - moment('00:00:00','HH:mm:ss')) / 1000,
            actor: x[1],
            comment: x[2],
            text: x[3],
            id: uuidv4(),
            active: false
        })
    )
  }

const saveState = (s, quiet) => {
    let key = getVideoId()
    let file = {}
    if (key === ""){
        return
    }
    let compressed = {
        mode: s.mode,
        items: s.items.map(x => {
            let item = {
                actor: x.actor,
                text: x.text,
                timestamp: x.timestamp,
                comment: x.comment
            }
            if(x.active){
                item.active = true
            }
            return item
        })
    }
    file[key] = LZString.compressToUTF16(JSON.stringify(compressed))
    chrome.storage.local.set(file, () => {
        if (!quiet) {
            message.success(i18nMsg("saveSuccess"));
        }
    })

}
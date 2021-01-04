
export const getMaxSpeaker = (input, prefix) => {
    let scene = prefix
    let scenePattern = new RegExp(scene + "(\\d+)","g")
    let maxnum = 0
    input.map(x => {
        if (x.actor) {
            let m = x.actor.match(scenePattern)
            if (m) {
                m.map(y=>{
                    let m1 = y.match(scene + "(\\d+)")
                    maxnum = Math.max(maxnum, m1[1])
                    return y
                })
            }
        }
        return x
    })
    return prefix+(maxnum+1)
}

export const sortArray = (input, prefix) => {
    let array = input.slice()
    array.sort((a, b) => a.timestamp - b.timestamp)
    let change = {}
    let index = 1;
    array = array.map((x, i) => {
        if(x.actor === undefined){
            x.actor = ""
        }
        let guestPattern = new RegExp(prefix + "\\d+","g")
        let m = x.actor.match(guestPattern)
        if (m) {
            m.map((y,i) => {
                if (change[y]) {
                    x.actor = x.actor.replace(y,"__#"+i+"#__")
                } else {
                    change[y] = prefix + index
                    x.actor = x.actor.replace(y,"__#"+i+"#__")
                    index++
                }
                return y
            })

            m.map((y,i) => {
                if (change[y]) {
                    x.actor = x.actor.replace("__#"+i+"#__",change[y])
                } 
                return y
            })
        }
        return x
    })
    return array
}


export const modeSequentialCreator = (defaultCandidates, prefix) => ({
    getDefaultCandidates: () => defaultCandidates,
    getNewSpeaker: timelineitems => getMaxSpeaker(timelineitems,prefix),
    rearrangeTimeline:  timelineitems => sortArray(timelineitems,prefix),
    prefixes: [prefix]
})
export const modeRepeatCreator = (defaultCandidates) => ({
    getDefaultCandidates: () => defaultCandidates,
    getNewSpeaker: timelineitems => ( timelineitems && timelineitems.length > 0 ) ? timelineitems[timelineitems.length-1].actor : "",
    rearrangeTimeline:  timelineitems => timelineitems.slice().sort((a, b) => a.timestamp - b.timestamp),
    prefixes: []
})
export const modeBackforthCreator = (defaultCandidates, prefix1, prefix2) => ({
    getDefaultCandidates: () => defaultCandidates,
    getNewSpeaker: timelineitems => {
        if (timelineitems.length === 0) {
            return getMaxSpeaker(timelineitems, prefix1)
        }

        if (timelineitems.length && timelineitems[timelineitems.length - 1].actor === prefix2) {
            return getMaxSpeaker(timelineitems, prefix1)
        } else {
            return prefix2
        }
    },
    rearrangeTimeline:  timelineitems => sortArray(timelineitems,prefix1),
    prefixes: [prefix1,prefix2]
})
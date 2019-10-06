/* global document */
import React,{useState , useEffect} from 'react'
import { connect } from 'react-redux'
import { Button, Icon, Card, Popover, Tooltip } from 'antd';
import { i18nMsg } from '../constants'
import { itemFocus, itemDel, videoGoto, itemUpdate, itemAdd } from '../redux/actions'
import moment from 'moment'
var dragX = 0
const FairyNoteMarkup = props => {
    const {
        timeline,
        itemFocus,
        videoGoto,
        itemDel,
        itemAdd,
        itemUpdate
    } = props
    
    const [progressBar, setProgressBar] = useState(
        document.querySelector('.ytp-progress-bar')
    );

    const [totalTime, setTotalTime] = useState(
        progressBar ? progressBar.attributes.getNamedItem('aria-valuemax').value : 0
    );
    useEffect(() => {
        /* events fired on the drop targets */
        document.addEventListener("dragover", ( event ) => {
            // prevent default to allow drop
            dragX = event.pageX
        }, false);
        // Select the node that will be observed for mutations
        const targetNode = document.querySelector('.ytp-progress-bar')
        if (targetNode) {
            // Options for the observer (which mutations to observe)
            const config = { attributes: true, childList: false, subtree: false };
            // Callback function to execute when mutations are observed
            const callback = function (mutationsList, observer) {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'attributes') {
                        if (mutation.attributeName === 'aria-valuemax') {
                            setProgressBar(targetNode)
                            setTotalTime(progressBar.attributes.getNamedItem('aria-valuemax').value)
                        }
                    }
                }
            };
            // Create an observer instance linked to the callback function
            const observer = new MutationObserver(callback);
            // Start observing the target node for configured mutations
            observer.observe(targetNode, config);
        }
    }, [])

    let content = (item, index) => {
        return (
            <div>
                <Card
                    style={{maxWidth: "420px"}}
                    title={
                        <div>
                            {moment.utc(0).seconds(item.timestamp).format("HH:mm:ss")} {item.actor} {item.comment ? "("+item.comment+")":""}
                        </div>
                    }
                    size="small">
                    {item.text}
                </Card>
                <span style={{ position: "absolute", top: "0.3em", right: 0 }} width="auto">
                    <Tooltip placement="topRight" title={i18nMsg("delete")} >
                        <Button size="small" type="link" onClick={() => { itemDel({ index: index }) }} tabIndex="-1">
                            <Icon type="delete" theme="filled" />
                        </Button>
                    </Tooltip>
                </span>
            </div>
        )
    }
    let handleDragStart = index => e => {
        itemFocus({index: index})
        // you must set some data in firefox to make things draggable... m0m
        e.dataTransfer.setData('Text', `${index}`);
    }
    let handleDragEnd = index => e => {
        console.log(dragX)
        let pRect = progressBar.getBoundingClientRect()
        let offset = dragX - pRect.x //firefox cannot get e.clientX 
        offset = Math.max(0,offset)
        offset = Math.min(pRect.width,offset)
        // for( var x in e){
        //     console.log(x+":"+e[x])
        // }
        console.log(totalTime)
        let newtime = Math.floor(totalTime * offset / pRect.width)
        console.log(newtime)
        itemUpdate({
            index: index,
            item: {
                timestamp: newtime
            }
        })
        videoGoto({goto: newtime })
        e.preventDefault()
    }
    let handleDoubleClick = e =>{
        let pRect = progressBar.getBoundingClientRect()
        let offset = e.clientX - pRect.x
        offset = Math.max(0,offset)
        offset = Math.min(pRect.width,offset)
        let newtime = Math.floor(totalTime * offset / pRect.width)
        videoGoto({goto: newtime })
        itemAdd()
    }
    let markup = (item, index) => (
        <div className="markup" key={index} draggable={true} 
        onDragStart={handleDragStart(index)} onDragEnd={handleDragEnd(index)} 
        style={{transform: "translateX(-15px)", left: item.timestamp*100/totalTime + "%" ,bottom: "-3px",position:"absolute"}}>
            <Popover content={content(item, index)} size="small" title="FairyNote2" placement="topRight" overlayStyle={{zIndex: 6000}}>
                <div size="small" type="link" onClick={() => {
                    itemFocus({index: index})
                    videoGoto({goto: item.timestamp })
                    }} tabIndex="-1">
                    {
                        item.active ? (<Icon type="down-square" theme="filled" style={{color:"rgba(255, 255, 0, 0.8)"}} />) : (<Icon type="caret-down" style={{color:"rgba(48, 200, 255, 0.8)"}}/>)
                    }
                </div>
            </Popover>
        </div>
    )
    let allowDrop = (ev) => {
        ev.preventDefault();
    }
    return (
        <Tooltip placement="topRight" title={i18nMsg("progresshint")}  overlayStyle={{whiteSpace: "pre-wrap", textAlign:"right"}}>
            <div className="extension-bar-markup" onDragOver={allowDrop} onDoubleClick={handleDoubleClick}> 
            {timeline.items.map(markup)}
            </div>
        </Tooltip>
    )
}


FairyNoteMarkup.propTypes = {

}


const mapStateToProps = (state, ownProps) => ({
    timeline: state.timeline
})

const mapDispatchToProps = {
    itemFocus, itemDel, videoGoto, itemUpdate ,itemAdd
}

export default connect(mapStateToProps, mapDispatchToProps)(FairyNoteMarkup)
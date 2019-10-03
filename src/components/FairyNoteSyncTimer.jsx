import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Switch ,Icon, Input } from 'antd'
import { i18nMsg } from '../constants'
import { getVideoTimeFromMagicWord } from '../redux/synctimer'
import { toggleSyncTimer } from '../redux/actions'

export class FairyNoteSyncTimer extends Component {
    state = {
        magicword: ""
    }

    syncVideo = () => {
        let video = document.querySelector('#primary #player video.video-stream')
        if (video){
            video.currentTime = getVideoTimeFromMagicWord(this.state.magicword)
            video.play()
        }
    }
    
    handleTextChange(e){
        let value = ""
        if(e && e.target && typeof(e.target.value) !== "undefined"){
          value =e.target.value
        }
        this.setState({
            magicword: value
        })
    }

    render() {
        const { 
            style, 
            isSyncStarted,
            toggleSyncTimer
        } = this.props

        //console.log(this.props)
        return (
            <div style={{ ...style }}>
                {i18nMsg("synctimer")}
                <div>
                <Switch
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="close" />}
                    checked={isSyncStarted}
                    onChange={(v) => {
                        return toggleSyncTimer({ isSyncStarted: v })
                    }}
                />
                </div>
                <div style={{marginTop:"10px"}}>
                <Input
                    placeholder={i18nMsg("magicword")}
                    disabled={isSyncStarted}
                    value={isSyncStarted ? "" : this.state.magicword}
                    onChange={this.handleTextChange.bind(this)}
                    addonAfter={<Icon type="play-square" disable={isSyncStarted.toString()}
                        onClick={isSyncStarted ? () => { } : this.syncVideo} />} defaultValue="mysite" />
                        </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isSyncStarted: state.status.isSyncStarted
})
const mapDispatchToProps = {
    toggleSyncTimer
}


export default connect(mapStateToProps, mapDispatchToProps)(FairyNoteSyncTimer)
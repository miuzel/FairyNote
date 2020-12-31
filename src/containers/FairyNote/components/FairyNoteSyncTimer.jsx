import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Switch , Input } from 'antd'
import { getVideoTimeFromMagicWord } from '../../../redux/synctimer'
import { toggleSyncTimer } from '../../../redux/actions'
import { withTranslation } from 'react-i18next';
import { CheckCircleFilled, CloseCircleFilled, PlaySquareFilled } from '@ant-design/icons'

@withTranslation()
class FairyNoteSyncTimer extends Component {
    state = {
        magicword: ""
    }

    syncVideo = () => {
        let video = document.querySelector('video')
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
            toggleSyncTimer,
            t
        } = this.props

        //console.log(this.props)
        return (
            <div style={{ ...style }}>
                {t("synctimer")}
                <div>
                <Switch
                    checkedChildren={<CheckCircleFilled />}
                    unCheckedChildren={<CloseCircleFilled />}
                    checked={isSyncStarted}
                    onChange={(v) => {
                        return toggleSyncTimer({ isSyncStarted: v })
                    }}
                />
                </div>
                <div style={{marginTop:"10px"}}>
                <Input
                    placeholder={t("magicword")}
                    disabled={isSyncStarted}
                    value={isSyncStarted ? "" : this.state.magicword}
                    onChange={this.handleTextChange.bind(this)}
                    addonAfter={<PlaySquareFilled disable={isSyncStarted.toString()}
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
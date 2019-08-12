import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Button } from 'antd'
import {toggleText} from '../redux/actions'
import {getFullText,copyTextToClipboard} from '../utils'

import { i18nMsg } from '../constants'

const FairyNoteText = ({ visible, toggleText,text }) => {
    return (
        <Modal
            visible={visible}
            onOk={toggleText}
            onCancel={toggleText}
            title={<div>
                <span>{i18nMsg("outputText")}</span>
                <Button type="link" id="copyButton" style={{marginLeft: "10px"}}
                    icon="copy" onClick={() => copyTextToClipboard(text)}>{i18nMsg("copyOutput")}</Button>
                <span>(Ctrl/Command+Shift+Z {i18nMsg("copyAnyTime")})</span>
              </div>
              }
            width="900px"
            okText={i18nMsg("confirm")}
            cancelText={i18nMsg("cancel")}
            key="modal-text">
            <pre id="#generated">{text}</pre>
        </Modal>
    )
}

FairyNoteText.propTypes = {


}


const mapStateToProps = (state) => ({
    visible: state.status.showingText,
    text: getFullText(state.timeline.items)
})

const mapDispatchToProps = {
    toggleText
}

export default connect(mapStateToProps, mapDispatchToProps)(FairyNoteText)
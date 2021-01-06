import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Button } from 'antd'
import {toggleText} from '../../../redux/actions'
import {getFullText,getCensoredText,copyTextToClipboard} from '../../../utils'

import { useTranslation } from 'react-i18next';
import { CopyFilled } from '@ant-design/icons'

const FairyNoteText = ({ visible, toggleText,text ,censoredWords}) => {
    const { t } = useTranslation()
    return (
        <Modal
            visible={visible}
            onOk={toggleText}
            cancelButtonProps={{ hidden: true }}
            onCancel={toggleText}
            title={<div>
                <span>{t("outputText")}</span>
                <Button type="link" id="copyButton" style={{marginLeft: "10px"}}
                    icon={<CopyFilled />} onClick={() => copyTextToClipboard(text) }>{t("copyOutput")}</Button>
                <span>(Ctrl/Command+Shift+Z {t("copyAnyTime")})</span>
              </div>
              }
            width="900px"
            okText={t("confirm")}
            cancelText={t("cancel")}
            key="modal-text">
            <pre id="#generated">{text}</pre>
        </Modal>
    )
}

FairyNoteText.propTypes = {


}


const mapStateToProps = (state) => ({
    visible: state.status.showingText,
    text: state.settings.censorWordEnabled ?
        getCensoredText(getFullText(state.timeline.items), state.settings.censoredWords) :
        getFullText(state.timeline.items)
})

const mapDispatchToProps = {
    toggleText
}

export default connect(mapStateToProps, mapDispatchToProps)(FairyNoteText)
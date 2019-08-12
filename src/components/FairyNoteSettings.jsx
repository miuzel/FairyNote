import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal } from 'antd';
import { toggleSettings,saveSettings } from '../redux/actions'
import AutoNavigate from './settings/AutoNavigate';
import Mode from './settings/Mode';
import AutoSave from './settings/AutoSave';
import AutoAddCandidate from './settings/AutoAddCandidate';
import CandidateList from './settings/CandidateList';
import { i18nMsg } from '../constants'
import Language from './settings/Language';

const FairyNoteSettings = ({ visible, toggleSettings,saveSettings }) => {
    return (
        <Modal
            visible={visible}
            onOk={()=>{
                toggleSettings()
                saveSettings()
            }}
            onCancel={toggleSettings}
            title={<div>
                <span>{i18nMsg("setting")}</span>
            </div>
            }
            okText={i18nMsg("confirm")}
            cancelButtonProps={{
                style: {display:"none"}
            }}
            cancelText={i18nMsg("cancel")}
            width="700px"
            key="modal-setting">

            <div >
                <Language style={{ margin: "10px" }} container={document.body} />
                <Mode style={{ margin: "10px" }} type="default" container={document.body} />
                <AutoNavigate style={{ margin: "10px" }} type="default" />
                <AutoSave style={{ margin: "10px" }} type="default" />
                <AutoAddCandidate style={{ margin: "10px" }} type="default" />
                <CandidateList style={{ margin: "10px" }}  />
            </div>

        </Modal>
    )
}

FairyNoteSettings.propTypes = {
}

const mapStateToProps = (state) => ({
    visible: state.status.showingSettings,
})

const mapDispatchToProps = {
    toggleSettings,
    saveSettings,
}

export default connect(mapStateToProps, mapDispatchToProps)(FairyNoteSettings)



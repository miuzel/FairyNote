import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal,Table } from 'antd';
import { shortcuts } from './FairyNoteShortcuts'
import { toggleHelp } from '../redux/actions'
import { i18nMsg } from '../constants'

const FairyNoteHelp = ({ visible, toggleHelp }) => {
    const columns = [
        {
            title: i18nMsg("keys"),
            dataIndex: 'key',
            key: 'key',
            width: '33%',
            render: text => <span style={{ fontWeight: "900" }}>{text}</span>,
    
        },
        {
            title: i18nMsg("actiondesc"),
            dataIndex: 'desc',
            key: 'desc',
        }
    ];
    let helpShortcuts = (
        <div>
            <Table bordered pagination={{
                pageSize: 15
            }} size="small" dataSource={shortcuts.map(x => ({ ...x, desc: i18nMsg(x.name) }))} columns={columns} />;
        </div>
    )
    return (
        <Modal
            visible={visible}
            onOk={toggleHelp}
            onCancel={toggleHelp}
            title={i18nMsg("help")}
            width="900px"
            okText={i18nMsg("confirm")}
            cancelText={i18nMsg("cancel")}
            key="modal-help">
            {helpShortcuts}
        </Modal>
    )
}

FairyNoteHelp.propTypes = {

}
const mapStateToProps = (state) => ({
    visible: state.status.showingHelp,
})
const mapDispatchToProps = {
    toggleHelp
}

export default connect(mapStateToProps, mapDispatchToProps)(FairyNoteHelp)
import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal,Table } from 'antd';
import { shortcuts } from './FairyNoteShortcuts'
import { toggleHelp } from '../../../redux/actions'
import { useTranslation } from 'react-i18next';

const FairyNoteHelp = ({ visible, toggleHelp }) => {
    const {t} = useTranslation()
    const columns = [
        {
            title: t("keys"),
            dataIndex: 'key',
            key: 'key',
            width: '33%',
            render: text => <span style={{ fontWeight: "900" }}>{text}</span>,
    
        },
        {
            title: t("actiondesc"),
            dataIndex: 'desc',
            key: 'desc',
        }
    ];
    let helpShortcuts = (
        <div>
            <Table bordered pagination={{
                pageSize: 15
            }} size="small" dataSource={shortcuts.map(x => ({ ...x, desc: t(x.name) }))} columns={columns} />;
        </div>
    )
    return (
        <Modal
            visible={visible}
            onOk={toggleHelp}
            onCancel={toggleHelp}
            title={t("help")}
            width="900px"
            okText={t("confirm")}
            cancelText={t("cancel")}
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
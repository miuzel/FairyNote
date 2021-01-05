import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal,Table } from 'antd';
import { toggleList } from '../../../redux/actions'
import { useTranslation } from 'react-i18next';

const FairyNoteList = ({ visible,notelist, toggleList }) => {
    const {t} = useTranslation()
    const columns = [
        {
            title: 'TITLE',
            width: '40%',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'SITE',
            dataIndex: 'site',
            key: 'site',
            width: '20%',
            render: text => <span style={{ fontWeight: "900" }}>{text}</span>,
    
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
        }
    ];

    //notelist = [{key:"abc",title:"ttt",url:"uuu"},{key:"abc1",title:"ttt1",url:"uuu1"}]
    let noteListTable = (
        <div>
            <Table bordered pagination={{
                pageSize: 15
            }} size="small" dataSource={notelist} columns={columns} />;
        </div>
    )
    return (
        <Modal
            visible={visible}
            cancelButtonProps={{ hidden: true }}
            onOk={toggleList}
            title={t("list")}
            width="900px"
            okText={t("confirm")}
            key="modal-list">
            {noteListTable}
        </Modal>
    )
}

FairyNoteList.propTypes = {

}
const mapStateToProps = (state) => ({
    visible: state.status.showingList,
    notelist: state.data.notelist
})
const mapDispatchToProps = {
    toggleList
}

export default connect(mapStateToProps, mapDispatchToProps)(FairyNoteList)
import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal,Table, Tabs } from 'antd';
import { toggleList } from '../../../redux/actions'
import { useTranslation } from 'react-i18next';
import moment from 'moment'

const FairyNoteList = ({ visible, notelist, toggleList }) => {
    const {t} = useTranslation()
    const columns = [
        {
            title: 'TITLE',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'UPDATE',
            width: '20%',
            dataIndex: 'update',
            key: 'update',
        }
    ];

    //notelist = [{key:"abc",title:"ttt",url:"uuu"},{key:"abc1",title:"ttt1",url:"uuu1"}]
    
    const { TabPane } = Tabs;

    let noteListTabs = (
        <Tabs defaultActiveKey="www.youtube.com">
            {
                Object.keys(notelist).map(x => {
                    let tableContent = Object.keys(notelist[x]).sort(
                        (a,b) => { 
                            return notelist[x][b].update - notelist[x][a].update
                        }
                    ).map(k =>  {
                                    let note = notelist[x][k]
                                    return   {
                                        title: (
                                            <a href={note.url}>{note.title}</a>
                                        ),
                                        update:moment(note.update).fromNow()
                                    }
                                }
                         )
                    let noteListTable = (
                        <div>
                            <Table key={"table"+x} bordered pagination={{
                                pageSize: 15
                            }} size="small" dataSource={tableContent} columns={columns} />;
                        </div>
                    )
                    return (
                      <TabPane tab={x} key={x}>
                           {noteListTable}
                      </TabPane>
                    )
                })
            }
      </Tabs>
     )
    return (
        <Modal
            visible={visible}
            cancelButtonProps={{ hidden: true }}
            onOk={toggleList}
            onCancel={toggleList}
            title={t("list")}
            width="900px"
            okText={t("confirm")}
            key="modal-list">
            {noteListTabs}
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
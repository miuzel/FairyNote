import React, { Component } from 'react'
import { Provider } from 'react-redux'
import "./fairynote.css";
import FairyNoteHeader from './components/FairyNoteHeader';
import FairyNoteTimeline from './components/FairyNoteTimeline';
import FairyNoteFooter from './components/FairyNoteFooter';
import FairyNoteSettings from './components/FairyNoteSettings';
import FairyNoteText from './components/FairyNoteText';
import FairyNoteHelp from './components/FairyNoteHelp';
import FairyNoteShortcuts from './components/FairyNoteShortcuts';
import store from '../../redux/store'
import { withTranslation } from 'react-i18next';
import { Layout , message} from 'antd';
import { timelineLoadAsync, settingsLoadAsync } from '../../redux/actions'
import 'antd/dist/antd.css';
import FairyNoteList from './components/FairyNoteList';

const { Header, Footer, Content } = Layout
// const parentDoc = document

@withTranslation()
class FairyNote extends Component {
    constructor(props){
        store.dispatch(settingsLoadAsync({ quiet: true }))
        // setTimeout(() => {
        //     store.dispatch(timelineLoadAsync({ quiet: false }))
        // }, 0)
        super(props)
    }
    componentDidMount() {
        setTimeout(() => {
            this.props.onLoad()
        }, 600)
        this.bindOnload()
    }
    bindOnload = () => {
        const { t } = this.props;
        let videoPlayer = document.querySelector('video')
        if(videoPlayer){
            videoPlayer.onloadeddata = () => {
                if(
                    document.URL.match(/youtube\.com\/watch\?v=.+/) ||
                    document.URL.match(/bilibili\.com\/video\/.+/) ||
                    document.URL.match(/odysee\.com\/.+/) ||
                    document.URL.match(/lbry.tv\/.+/) ||
                    document.URL.match(/localhost/) // test env
                  ){
                    console.log("url changed. Reload data.")
                    store.dispatch(timelineLoadAsync({ quiet: false }))
                } else {
                    message.warn(t("cannotFindVideoID"))
                }
            }
        } else {
            message.warn(t("cannotFindVideoID"))
        }
    }
    
    render() {
        const { toggle ,app} = this.props
        return (
            <Provider store={store}>
                <Layout id="extensionlayout">
                    <Header id="extensionheader">
                        <FairyNoteHeader container={app} />
                    </Header>
                    <Content id="extensioncontent">
                        <FairyNoteTimeline container={app} />
                    </Content>
                    <Footer id="extensionfooter">
                        <FairyNoteFooter />
                    </Footer>
                    {/* hidden parts */}
                    <div height="0px">
                        <FairyNoteSettings />
                        <FairyNoteText />
                        <FairyNoteHelp />
                        <FairyNoteList />
                        <FairyNoteShortcuts toggle={toggle} />
                        {/* <FairyNoteShortcuts name="parent" container={parentDoc.body} toggle={toggle} /> */}
                    </div>
                </Layout>
            </Provider>
        )
    }
}

export default FairyNote


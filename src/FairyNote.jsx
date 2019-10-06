/* global document */
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
import store from './redux/store'
import { i18nMsg } from './constants'
import { Layout , message} from 'antd';
import { timelineLoadAsync, settingsLoadAsync } from './redux/actions'

const { Header, Footer, Content } = Layout
// const parentDoc = document

export class FairyNote extends Component {
    constructor(props){
        store.dispatch(settingsLoadAsync({ quiet: true }))
        setTimeout(() => {
            store.dispatch(timelineLoadAsync({ quiet: false }))
        }, 0)
        super(props)
    }
    componentDidMount() {
        setTimeout(() => {
            this.props.onLoad()
        }, 600)
        this.bindOnload()
    }
    bindOnload = () => {
        let videoPlayer = document.querySelector('video')
        if(videoPlayer){
            videoPlayer.onloadeddata = () => {
                if(document.URL.match(/youtube\.com\/watch\?v=.+/)||
                document.URL.match(/localhost/)  ){// test env
                    console.log("url changed. Reload data.")
                    store.dispatch(timelineLoadAsync({ quiet: false }))
                } else {
                    message.warn(i18nMsg("cannotFindVideoID"))
                }
            }
        } else {
            message.warn(i18nMsg("cannotFindVideoID"))
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
                    <div height="0px">
                        <FairyNoteSettings />
                        <FairyNoteText />
                        <FairyNoteHelp />
                        <FairyNoteShortcuts toggle={toggle} />
                        {/* <FairyNoteShortcuts name="parent" container={parentDoc.body} toggle={toggle} /> */}
                    </div>
                </Layout>
            </Provider>
        )
    }
}

export default FairyNote


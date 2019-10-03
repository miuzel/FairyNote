/* global document */
import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
// import Frame, { FrameContextConsumer } from 'react-frame-component';
import "./fairynote.css";
import FairyNoteHeader from './FairyNoteHeader';
import FairyNoteTimeline from './FairyNoteTimeline';
import FairyNoteFooter from './FairyNoteFooter';
import FairyNoteSettings from './FairyNoteSettings';
import FairyNoteText from './FairyNoteText';
import FairyNoteHelp from './FairyNoteHelp';
import FairyNoteShortcuts from './FairyNoteShortcuts';
import store from '../redux/store'
import { i18nMsg } from '../constants'
import { Layout , message} from 'antd';
import { timelineLoadAsync, settingsLoadAsync } from '../redux/actions'

const { Header, Footer, Content } = Layout
// const parentDoc = document

export class FairyNote extends Component {
    componentWillMount(){
        store.dispatch(settingsLoadAsync({ quiet: true }))
        setTimeout(() => {
            store.dispatch(timelineLoadAsync({ quiet: false }))
        }, 0)
    }
    componentDidMount() {
        setTimeout(() => {
            this.props.onLoad()
        }, 600)
        this.bindOnload()
    }
    bindOnload = () => {
        let videoPlayer = document.querySelector('#primary #player video.video-stream')
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
            // <Frame head={[<link type="text/css" rel="stylesheet" key='0'
            //     href={chrome.runtime.getURL("/static/css/content.css")}></link>]}>
            //     <FrameContextConsumer key='1'>
            //         {
            //             // Callback is invoked with iframe's window and document instances
            //             ({ document, window }) => {
            //                 return (
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
            //                 )
            //             }
            //         }
            //     </FrameContextConsumer>
            // </Frame>

        )
    }
}

FairyNote.propTypes = {
}


export default FairyNote


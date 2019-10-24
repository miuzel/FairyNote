import React from 'react'
import { i18nMsg } from '../constants'
import { Drawer, Menu,Icon, Button } from 'antd'
import { connect } from 'react-redux'
import {toggleMenu,timelineLoadAsync,timelineSave,timelineReset,toggleText,toggleHelp,toggleSettings,timelineExport, timelineImportAsync, timelineExportSrt} from '../redux/actions'
import Mode from './settings/Mode';
import AutoNavigate from './settings/AutoNavigate'
import FairyNoteSyncTimer from './FairyNoteSyncTimer';

const {SubMenu} = Menu

const getKey = () => {
    let key = 'localdata'
    let m = document.URL.match(/watch\?v=([^&]+)/);
    if (m){
       key = m[1]
    }
    return key 
};

const FairyNoteHeader = ({ toggleMenu, defaultMode, showingMenu ,timelineLoadAsync, timelineSave,timelineExport ,timelineImportAsync,timelineReset,timelineExportSrt, toggleText, toggleHelp, toggleSettings, container }) => {
    const menus = [
        {
            name: (<span><Icon type="file" /> {i18nMsg("file")}</span>),
            children: [
                {
                    name: "save",
                    icon: "save",
                    onClick: () => timelineSave({ key: getKey() })
                },
                {
                    name: "load",
                    icon: "cloud-download",
                    onClick: () => timelineLoadAsync({ key: getKey() ,defaultMode})
                },
                {
                    name: "export",
                    icon: "export",
                    onClick: () => timelineExport({ key: getKey() })
                },
                {
                    name: "import",
                    icon: "import",
                    onClick: () => timelineImportAsync({ key: getKey() })
                },
                {
                    name: "exportsrt",
                    icon: "export",
                    onClick: () => timelineExportSrt({ key: getKey() })
                },
                {
                    name: "reset",
                    icon: "delete",
                    onClick: () => timelineReset({ key: getKey() })
                }
            ]
        },
        {
            name: "output", 
            icon: "copy",
            onClick: toggleText
        },
        {
            name: "setting",
            icon: "setting",
            onClick: toggleSettings
        },
        {
            name: "help",
            icon: "question-circle",
            onClick: toggleHelp
        }
    ]
    return (
        <div id="pageheader" style={{display:"inline-block",whiteSpace:"nowrap"}}> 

            <Icon className="menubutton" type="menu" onClick={toggleMenu} />
            <span id="pagetitle" style={{  color: "#eee", fontSize: "14px", fontWeight: "normal"}}>
                <span style={{display: "inline",marginRight: "10px",fontWeight: "600"  , fontSize: "20px" }}>{i18nMsg("extensionName")}</span>
                |
                    <Button style={{ color: "#eee", }} size="small" type="link" id="genButton"
                    icon="copy" onClick={() => toggleText()}>{i18nMsg("output")}</Button>
                |
                    <AutoNavigate style={{display: "inline",marginLeft: "10px",marginRight: "10px"   }} />
                |
                    <Mode style={{display: "inline" , marginLeft: "10px" }} container={container}/>

                    <Icon  style={{display: "inline" , marginLeft: "10px" }}
                      size="small"  type="question-circle" onClick={()=>toggleHelp()}></Icon>

            </span>
        
        <Drawer
          title={`${i18nMsg("extensionName")} - ${i18nMsg("menu")}`}
          placement="left"
          style={{
              overflowX: "hidden",
              transitionProperty: "width",
              transitionDuration: "0.3s",
              transitionTimingFunction: "cubic-bezier(0.7, 0.3, 0.1, 1)",
          }}
          maskStyle={{
              position:"absolute"
          }}
          closable={true}
          onClose={toggleMenu}
          visible={showingMenu}
          bodyStyle={{padding:"5px"}}
          getContainer={() => container}
        >
        <Menu  style={{ lineHeight: "24px" }} selectable={false}
            getPopupContainer={() => container} mode="vertical">
            {loadMenus(menus)}
        </Menu>
        <FairyNoteSyncTimer style={{ lineHeight: "24px" ,padding: "10px"}}/>
        </Drawer>

        </div>
            )
}
const loadMenus = (m) => {
    let res = []
    m.map((x,i) => {
        if (x.children) {
            res.push( <SubMenu key={i} title={x.name}>{loadMenus(x.children)}</SubMenu>)
        }  
        else {
            res.push( <Menu.Item key={i} onClick={x.onClick}>
                <span><Icon type={x.icon} /> {i18nMsg(x.name)}</span></Menu.Item>) 
        }
        return x
    })
    return res
}

const mapStateToProps = (state) => ({
    showingMenu: state.status.showingMenu,
    defaultMode: state.settings.defaultMode
})

const mapDispatchToProps = {
    toggleMenu,timelineLoadAsync,timelineSave,timelineReset,toggleText,toggleHelp,toggleSettings,timelineImportAsync,timelineExport,timelineExportSrt
}

export default connect(mapStateToProps, mapDispatchToProps)(FairyNoteHeader)

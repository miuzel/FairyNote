import React from 'react'
import { useTranslation } from 'react-i18next'
import { Drawer, Menu, Button } from 'antd'
import { connect } from 'react-redux'
import {toggleMenu,timelineLoadAsync,timelineSave,timelineReset,toggleText,toggleHelp,toggleSettings,timelineExport, timelineImportAsync, timelineExportSrt} from '../../../redux/actions'
import Mode from './settings/Mode';
import AutoNavigate from './settings/AutoNavigate'
import FairyNoteSyncTimer from './FairyNoteSyncTimer'
import { FileFilled, SaveFilled, CloudDownloadOutlined, ExportOutlined, ImportOutlined, DeleteFilled, QuestionCircleFilled, MenuOutlined, CopyFilled ,SettingFilled} from "@ant-design/icons"


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
    const {t} = useTranslation()
    const menus = [
        {
            name: (<span><FileFilled /> {t("file")}</span>),
            children: [
                {
                    name: "save",
                    icon: <SaveFilled />,
                    onClick: () => timelineSave({ key: getKey() })
                },
                {
                    name: "load",
                    icon: <CloudDownloadOutlined />,
                    onClick: () => timelineLoadAsync({ key: getKey() ,defaultMode})
                },
                {
                    name: "export",
                    icon: <ExportOutlined />,
                    onClick: () => timelineExport({ key: getKey() })
                },
                {
                    name: "import",
                    icon: <ImportOutlined />,
                    onClick: () => timelineImportAsync({ key: getKey() })
                },
                {
                    name: "exportsrt",
                    icon: <ExportOutlined />,
                    onClick: () => timelineExportSrt({ key: getKey() })
                },
                {
                    name: "reset",
                    icon: <DeleteFilled />,
                    onClick: () => timelineReset({ key: getKey() })
                }
            ]
        },
        {
            name: "output", 
            icon: <CopyFilled/>,
            onClick: toggleText
        },
        {
            name: "setting",
            icon: <SettingFilled />,
            onClick: toggleSettings
        },
        {
            name: "help",
            icon: <QuestionCircleFilled />,
            onClick: toggleHelp
        }
    ]
    console.log("walawala")
    console.log(container)
    return (
        <div id="pageheader" style={{display:"inline-block",whiteSpace:"nowrap"}}> 

            <MenuOutlined className="menubutton" onClick={toggleMenu} />
            <span id="pagetitle" style={{  color: "#eee", fontSize: "14px", fontWeight: "normal"}}>
                <span style={{display: "inline",marginRight: "10px",fontWeight: "600"  , fontSize: "20px" }}>{t("extensionName")}</span>
                |
                    <Button style={{ color: "#eee", }} size="small" type="link" id="genButton"
                    icon={<CopyFilled/>} onClick={() => toggleText()}>{t("output")}</Button>
                |
                    <AutoNavigate style={{display: "inline",marginLeft: "10px",marginRight: "10px"   }} />
                |
                    <Mode style={{display: "inline" , marginLeft: "10px" }} container={container}/>

                    <QuestionCircleFilled  style={{display: "inline" , marginLeft: "10px" }}
                      size="small"  onClick={()=>toggleHelp()}></QuestionCircleFilled>

            </span>
            
            <Drawer
                title={`${t("extensionName")} - ${t("menu")}`}
                placement="left"
                style={{
                    overflowX: "hidden",
                    transitionProperty: "width",
                    transitionDuration: "0.3s",
                    transitionTimingFunction: "cubic-bezier(0.7, 0.3, 0.1, 1)",
                }}
                // maskStyle={{
                //     position:"absolute"
                // }}
                closable={true}
                onClose={toggleMenu}
                visible={showingMenu}
                bodyStyle={{padding:"5px"}}
                getContainer={() => container}
            >
                <Menu  style={{ lineHeight: "24px" }} selectable={false}
                    getPopupContainer={() => container} mode="vertical">
                    {loadMenus(menus,t)}
                </Menu>
                <FairyNoteSyncTimer style={{ lineHeight: "24px" ,padding: "10px"}}/>
            </Drawer>

        </div>
            )
}
const loadMenus = (m,t) => {
    let res = []
    m.map((x,i) => {
        if (x.children) {
            res.push( <SubMenu key={"menu_" + x.name} title={x.name}>{loadMenus(x.children,t)}</SubMenu>)
        }  
        else {
            res.push( <Menu.Item key={"menu_" + x.name} onClick={x.onClick}>
                <span>{x.icon}  {t(x.name)}</span></Menu.Item>) 
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

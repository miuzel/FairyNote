/* global chrome */
import * as types from './types'
import { message } from 'antd'
import uuidv4 from 'uuid/v4';
import { getVideoId } from '../../utils';
import defaultSettings from '../../defaultSettings'
import i18next from 'i18next'

import LZString from 'lz-string'
const { t } = i18next
const actionCreatorCreator = actionType => payload => ({
  type: actionType,
  payload
})

const actionCreatorCreatorWithSettings = actionType => payload => (dispatch,getState) => {
  const state = getState()
  const settings = state.settings
  dispatch({
    type: actionType,
    payload: {
      ...payload,
      settings
    }
  })
}

const actionCreatorCreatorWithData = actionType => payload => (dispatch,getState) => {
  const state = getState()
  const data = state.data
  const autoSave = state.settings.autoSave
  dispatch({
    type: actionType,
    payload: {
      ...payload,
      data,
      autoSave
    }
  })
}


export const settingsLoadAsync = (payload) => dispatch => {
  const key = "FairyNote#Settings"
  chrome.storage.sync.get([key], function (result) {
    let savedState
    if (result && result[key]) {
      for (var k in defaultSettings){
        if(result[key][k] === undefined){
          result[key][k] = defaultSettings[k]
        }
      }
      savedState = result[key];
    }
    if (!savedState) {
      savedState = defaultSettings
    }
    if (!payload.quiet) {
      message.success(t("loadSuccess"));
    }
    dispatch(loadSettings(savedState))
  })
}


export const timelineLoadAsync = (payload) => (dispatch, getState) => {
  let key = getVideoId()
  if (key === ""){
      return
  }
  chrome.storage.local.get([key], function (result) {
    let savedState
    if (result) {
      if(result[key] !== undefined){
        savedState = JSON.parse(LZString.decompressFromUTF16(result[key]));
        savedState.items = savedState.items.map(x=>({...x,id:uuidv4()}))
      }
    }
    if (!savedState) {
      const state = getState()
      savedState = {
        mode: state.settings.defaultMode,
        items: []
      };
    }
    if (!payload.quiet) {
      message.success("loadSuccess");
    }
    dispatch(timelineLoaded(savedState))
  })
}

export const timelineImportAsync = (payload) => dispatch => {
  let fileChooser = document.createElement("input")
  fileChooser.type = 'file'
  fileChooser.addEventListener('change', function (e) {
    let f = e.target.files[0]
    if (f) {
      let reader = new FileReader()
      reader.onload = function (e) {
        let data = e.target.result
        if (!payload.quiet){
          message.success(t("importSuccess"));
        }
        dispatch(timelineImport({
          csvdata: data
        }))
      }
      reader.readAsText(f)
    }
  });
  fileChooser.click()
}


export const timelineSave = actionCreatorCreator(types.TIMELINE_SAVE)
export const timelineLoaded = actionCreatorCreator(types.TIMELINE_LOAD)
export const timelineReset = actionCreatorCreator(types.TIMELINE_RESET)
export const timelineExport = actionCreatorCreator(types.TIMELINE_EXPORT)
export const timelineImport = actionCreatorCreator(types.TIMELINE_IMPORT)
export const timelineExportSrt = actionCreatorCreator(types.TIMELINE_EXPORT_SRT)

export const itemAdd = actionCreatorCreatorWithData(types.ITEM_ADD)
export const itemCopy = actionCreatorCreatorWithData(types.ITEM_COPY)
export const itemUpdate = actionCreatorCreatorWithData(types.ITEM_UPDATE)

export const itemDel = actionCreatorCreatorWithData(types.ITEM_DEL)
export const itemFocus = actionCreatorCreatorWithSettings(types.ITEM_FOCUS)
export const itemBlur = actionCreatorCreator(types.ITEM_BLUR)

export const videoGoto = actionCreatorCreator(types.VIDEO_GOTO)
export const videoGotoEnd = actionCreatorCreator(types.VIDEO_GOTO_END)

export const modeUpdate = actionCreatorCreator(types.MODE_UPDATE)
export const settingsUpdate = actionCreatorCreator(types.SETTINGS_UPDATE)
export const toggleSyncTimer = actionCreatorCreator(types.TOGGLE_SYNC_TIMER)

export const dataUpdate = actionCreatorCreator(types.DATA_UPDATE)
export const toggleText = actionCreatorCreator(types.TOGGLE_TEXT)
export const toggleHelp = actionCreatorCreator(types.TOGGLE_HELP)
export const toggleSettings = actionCreatorCreator(types.TOGGLE_SETTINGS)
export const toggleMenu = actionCreatorCreator(types.TOGGLE_MENU)

export const saveSettings = actionCreatorCreator(types.SAVE_SETTINGS)
export const loadSettings = actionCreatorCreator(types.LOAD_SETTINGS)

export const textCopy = actionCreatorCreatorWithSettings(types.TEXT_COPY)

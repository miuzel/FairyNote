import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { timelineSave } from "../redux/actions";
import { i18nMsg } from "../constants";


const FairyNoteFooter = props => {
  const [ autoSaveTimer, setAutoSaveTimer ] = useState(null);
  const [ saving, setSaving ] = useState(0);
  const { autoSave, changed, timelineSave } = props;
  const timer =  () => {
    setSaving(1);
    setTimeout(()=> {
        timelineSave({ quiet: true })
    },0);
  }
  const stopTimer = () => {
    clearInterval(autoSaveTimer);
    setSaving(0);
    setAutoSaveTimer(null);
  }
  useEffect(() => {
    if (autoSave) {
      if (!autoSaveTimer) {
        console.log("set up autosave");
        setAutoSaveTimer(setInterval(timer, 1000));
      }
    } else {
      if (autoSaveTimer) {
        console.log("cancel autosave");
        stopTimer();
      }
    }
    if (saving && !changed) {
      setSaving(0);
    }
    
  }, [autoSave,saving,changed]);

  return (
    <div id="extensionfooter">
      © 2019 FairyNote --VERSION--{" "}
      {autoSave
        ? changed
            ? i18nMsg("changed")
            : ""
        : changed
            ? saving
            ? i18nMsg("saving")
            : i18nMsg("pendsaving")
            : ""}
    </div>
  );
};


const mapStateToProps = (state) => ({
    autoSave: state.settings.autoSave,
    changed: state.timeline.changed
})

const mapDispatchToProps = {
    timelineSave
}

export default connect(mapStateToProps, mapDispatchToProps)(FairyNoteFooter)
